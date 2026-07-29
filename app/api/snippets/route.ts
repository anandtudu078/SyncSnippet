import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { repository_full_name, file_path, start_line, end_line, branch, language } = body;

  const { data, error } = await supabase
    .from('snippets')
    .insert({
      owner_id: user.id,
      repository_full_name,
      file_path,
      start_line,
      end_line,
      branch: branch || 'main',
      language,
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}