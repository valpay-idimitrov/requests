import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to vote.' }, { status: 401 });
  }

  const { data: existingVote, error: existingError } = await supabase
    .from('votes')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('request_id', params.id)
    .maybeSingle();
  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });

  if (existingVote) {
    const { error } = await supabase.from('votes').delete().eq('user_id', user.id).eq('request_id', params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase.from('votes').insert({ user_id: user.id, request_id: params.id });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: votes, error: votesError } = await supabase
    .from('votes')
    .select('user_id')
    .eq('request_id', params.id);
  if (votesError) return NextResponse.json({ error: votesError.message }, { status: 500 });

  const voterIds = (votes || []).map(v => v.user_id);
  let voters: { email: string; role: string; weight: number }[] = [];
  if (voterIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email, role, vote_weight')
      .in('id', voterIds);
    if (profilesError) return NextResponse.json({ error: profilesError.message }, { status: 500 });
    voters = (profiles || []).map(p => ({ email: p.email, role: p.role, weight: p.vote_weight }));
  }

  return NextResponse.json({
    id: params.id,
    votes: voters.length,
    weightedVotes: voters.reduce((sum, v) => sum + v.weight, 0),
    voters,
    votedByMe: !existingVote
  });
}
