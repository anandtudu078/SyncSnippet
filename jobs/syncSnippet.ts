import { inngest } from '@/lib/inngest';
import { getGitHubApp } from '@/lib/github';
import { createClient } from '@supabase/supabase-js';
import { getHighlighter } from 'shiki';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function detectLanguage(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx',
    py: 'python', rs: 'rust', go: 'go', html: 'html', css: 'css',
    json: 'json', md: 'markdown', yml: 'yaml', yaml: 'yaml',
  };
  return map[ext ?? ''] ?? 'text';
}

export const syncSnippetOnPush = inngest.createFunction(
  { id: 'sync-snippet-on-push' },
  { event: 'github/push' },
  async ({ event }) => {
    const { repoFullName, branch, installationId } = event.data;

    const { data: snippets } = await supabaseAdmin
      .from('snippets')
      .select('*')
      .eq('repository_full_name', repoFullName)
      .eq('branch', branch)
      .eq('status', 'active');

    if (!snippets?.length) return;

    const app = getGitHubApp();
    const octokit = await app.getInstallationOctokit(installationId);

    const highlighter = await getHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: [],
    });

    for (const snippet of snippets) {
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner: repoFullName.split('/')[0],
          repo: repoFullName.split('/')[1],
          path: snippet.file_path,
          ref: `refs/heads/${branch}`,
        });

        if (!('content' in data)) continue;

        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        const lines = content.split('\n');
        const selected = lines.slice(snippet.start_line - 1, snippet.end_line).join('\n');

        const lang = snippet.language || detectLanguage(snippet.file_path);
        const theme = 'github-dark';
        const html = highlighter.codeToHtml(selected, { lang, theme });

        await supabaseAdmin
          .from('snippets')
          .update({
            rendered_html: html,
            last_synced_at: new Date().toISOString(),
            commit_sha: data.sha,
          })
          .eq('id', snippet.id);

        await supabaseAdmin.from('snippet_versions').insert({
          snippet_id: snippet.id,
          rendered_html: html,
          commit_sha: data.sha,
        });
      } catch (err) {
        console.error(`Sync failed for snippet ${snippet.id}`, err);
        await supabaseAdmin
          .from('snippets')
          .update({ status: 'error' })
          .eq('id', snippet.id);
      }
    }
  }
);