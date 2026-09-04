import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RequestRow {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  urgency: string | null;
  gmv_label: string | null;
  gmv_value: number | null;
  partner: string | null;
  categories: string[] | null;
  audience: string[] | null;
  primary_category: string | null;
  compliance: boolean | null;
  submitted_by: string | null;
  created_at: string | null;
}

function serialize(
  row: RequestRow,
  voterIdsByRequest: Map<string, string[]>,
  emailById: Map<string, string>,
  myUserId: string | null
) {
  const voterIds = voterIdsByRequest.get(row.id) || [];
  const voterEmails = voterIds.map(id => emailById.get(id)).filter((e): e is string => !!e);
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    status: row.status || 'Not started',
    urgency: row.urgency || '',
    gmvLabel: row.gmv_label || '',
    gmvValue: Number(row.gmv_value) || 0,
    partner: row.partner || '',
    categories: row.categories || [],
    primaryCategory: row.primary_category || '',
    audience: row.audience || [],
    created: row.created_at || new Date().toISOString(),
    votes: voterEmails.length,
    voters: voterEmails,
    votedByMe: !!(myUserId && voterIds.includes(myUserId)),
    submittedBy: (row.submitted_by && emailById.get(row.submitted_by)) || '',
    compliance: !!row.compliance
  };
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: requests, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (requests || []) as RequestRow[];
  const requestIds = rows.map(r => r.id);

  const { data: votes, error: votesError } = requestIds.length
    ? await supabase.from('votes').select('user_id, request_id').in('request_id', requestIds)
    : { data: [] as { user_id: string; request_id: string }[], error: null };
  if (votesError) return NextResponse.json({ error: votesError.message }, { status: 500 });

  const voterIdsByRequest = new Map<string, string[]>();
  (votes || []).forEach(v => {
    const list = voterIdsByRequest.get(v.request_id) || [];
    list.push(v.user_id);
    voterIdsByRequest.set(v.request_id, list);
  });

  // Resolve every user id we'll need to display (submitters + voters) to an
  // email in one query, since `requests`/`votes` only store uuids.
  const neededIds = new Set<string>();
  rows.forEach(r => { if (r.submitted_by) neededIds.add(r.submitted_by); });
  (votes || []).forEach(v => neededIds.add(v.user_id));

  const emailById = new Map<string, string>();
  if (neededIds.size > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', Array.from(neededIds));
    if (profilesError) return NextResponse.json({ error: profilesError.message }, { status: 500 });
    (profiles || []).forEach(p => emailById.set(p.id, p.email));
  }

  return NextResponse.json({
    requests: rows.map(r => serialize(r, voterIdsByRequest, emailById, user?.id ?? null))
  });
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to submit a request.' }, { status: 401 });
  }

  let body: { title?: string; description?: string; gmvValue?: number; gmvLabel?: string; compliance?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const title = (body.title || '').trim();
  const description = (body.description || '').trim();
  if (!title) return NextResponse.json({ error: 'Please add a title.' }, { status: 400 });
  if (!description) return NextResponse.json({ error: 'Please add a description.' }, { status: 400 });

  // `requests.id` is text with no default, so we generate one here.
  const id = `req-${crypto.randomUUID()}`;

  const { error: insertError } = await supabase.from('requests').insert({
    id,
    title,
    description,
    gmv_value: Number.isFinite(body.gmvValue) ? Math.max(0, Math.round(body.gmvValue as number)) : 0,
    gmv_label: body.gmvLabel || '',
    compliance: !!body.compliance,
    submitted_by: user.id
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Submitting a request auto-casts the submitter's own vote, matching the
  // original prototype's behavior (new requests start at 1 vote).
  const { error: voteError } = await supabase.from('votes').insert({ user_id: user.id, request_id: id });
  if (voteError) {
    return NextResponse.json({ error: voteError.message }, { status: 500 });
  }

  const { data: created, error: fetchError } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchError || !created) {
    return NextResponse.json({ error: fetchError?.message || 'Request created but failed to load.' }, { status: 500 });
  }

  const voterIdsByRequest = new Map<string, string[]>([[id, [user.id]]]);
  const emailById = new Map<string, string>([[user.id, user.email || '']]);

  return NextResponse.json({
    request: serialize(created as RequestRow, voterIdsByRequest, emailById, user.id)
  });
}
