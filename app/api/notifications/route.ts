import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get recent snippet versions (syncs) with snippet name
  const { data, error } = await supabase
    .from('snippet_versions')
    .select('id, created_at, commit_sha, snippet: snippets ( id, file_path )')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Transform to a friendly list
  const notifications = data.map((version: any) => ({
    id: version.id,
    file: version.snippet?.file_path || 'unknown',
    commit: version.commit_sha?.slice(0, 7),
    time: version.created_at,
  }));

  return NextResponse.json(notifications);
}