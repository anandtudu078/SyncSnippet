import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getGitHubApp } from '@/lib/github';

export async function GET(
  request: Request,
  { params }: { params: { owner: string; repo: string } }
) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: installations } = await supabase
    .from('installations')
    .select('id')
    .eq('owner_id', user.id);

  if (!installations?.length) return NextResponse.json({ error: 'No installations' }, { status: 400 });

  const app = getGitHubApp();
  for (const inst of installations) {
    try {
      const octokit = await app.getInstallationOctokit(inst.id);
      const { data } = await octokit.rest.repos.getContent({
        owner: params.owner,
        repo: params.repo,
        path,
      });
      return NextResponse.json(data);
    } catch (err) {
      // try next installation
    }
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}