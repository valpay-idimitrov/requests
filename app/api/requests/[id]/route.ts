import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to edit a request.' }, { status: 401 });
  }

  let body: { description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const description = (body.description ?? '').trim();
  if (!description) {
    return NextResponse.json({ error: 'Description cannot be empty.' }, { status: 400 });
  }

  // Only `description` is ever written here — any other fields in the body
  // are ignored, and the DB grant (see supabase/migrations) enforces the
  // same restriction at the column level regardless of what's sent.
  const { data, error } = await supabase
    .from('requests')
    .update({ description })
    .eq('id', params.id)
    .select('id, description')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Request not found.' }, { status: 404 });
  }

  return NextResponse.json({ id: data.id, description: data.description });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to delete a request.' }, { status: 401 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from('requests')
    .select('id, submitted_by')
    .eq('id', params.id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
  }
  if (existing.submitted_by !== user.id) {
    return NextResponse.json({ error: 'You can only delete requests you submitted.' }, { status: 403 });
  }

  // Votes are cleaned up automatically via ON DELETE CASCADE (see the
  // supabase/migrations entry that added it) — no need to delete them here.
  const { error: deleteError } = await supabase.from('requests').delete().eq('id', params.id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
