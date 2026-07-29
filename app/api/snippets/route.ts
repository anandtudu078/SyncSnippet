import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const FREE_TIER_LIMIT = 5;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check current snippet count for free tier limit
  const { count, error: countError } = await supabase
    .from('snippets')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id);

  if (countError) {
    return NextResponse.json({ error: 'Failed to check snippet count' }, { status: 500 });
  }

  if (count !== null && count >= FREE_TIER_LIMIT) {
    return NextResponse.json(
      { error: `Free tier limit reached. You can only create ${FREE_TIER_LIMIT} snippets. Upgrade to Pro for more.` },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { repository_full_name, file_path, start_line, end_line, branch, language } = body;

  if (!repository_full_name || !file_path || !start_line || !end_line) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('snippets')
    .insert({
      owner_id: user.id,
      repository_full_name,
      file_path,
      start_line,
      end_line,
      branch: branch || 'main',
      language: language || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Snippet insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}