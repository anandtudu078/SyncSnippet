import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getGitHubApp } from '@/lib/github';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: installations } = await supabase
    .from('installations')
    .select('id')
    .eq('owner_id', user.id);

  if (!installations?.length) return NextResponse.json([]);

  const app = getGitHubApp();
  const repos: { full_name: string; private: boolean }[] = [];

  for (const inst of installations) {
    try {
      const octokit = await app.getInstallationOctokit(inst.id);
      // Use generic request instead of rest.apps
      const response = await octokit.request('GET /installation/repositories', {
        per_page: 100,
      });
      const reposData = response.data.repositories;
      repos.push(...reposData.map((r: any) => ({
        full_name: r.full_name,
        private: r.private,
      })));
    } catch (err) {
      console.error(`Failed to fetch repos for installation ${inst.id}`, err);
    }
  }

  return NextResponse.json(repos);
}