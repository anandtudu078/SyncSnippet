import { Webhooks } from '@octokit/webhooks';
import { getGitHubApp } from '@/lib/github';
import { createClient } from '@supabase/supabase-js';
import { createHighlighter } from 'shiki';

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

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

export async function POST(req: Request) {
  const signature = req.headers.get('x-hub-signature-256') ?? '';
  const body = await req.text();

  if (!webhooks.verify(body, signature)) {
    return new Response('Forbidden', { status: 403 });
  }

  const event = JSON.parse(body);
  if (event.zen) return new Response('pong');

  if (event.ref?.startsWith('refs/heads/') && event.commits?.length > 0) {
    const branch = event.ref.replace('refs/heads/', '');
    const repoFullName = event.repository.full_name;
    const installationId = event.installation.id;

    console.log('🔍 Searching snippets for:', repoFullName, branch);

    const { data: snippets } = await supabaseAdmin
      .from('snippets')
      .select('*')
      .eq('repository_full_name', repoFullName)
      .eq('branch', branch)
      .eq('status', 'active');

    console.log('📋 Found snippets:', snippets?.length);

    if (!snippets?.length) {
      return new Response('No matching snippets', { status: 200 });
    }

    // Get authenticated Octokit instance using the installation ID
    const app = getGitHubApp();
    const octokit = await app.getInstallationOctokit(installationId);

    // Prepare highlighter
    const highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript', 'javascript', 'jsx', 'tsx', 'python', 'rust', 'go', 'html', 'css', 'json', 'markdown', 'yaml'],
    });

    const [owner, repo] = repoFullName.split('/');

    for (const snippet of snippets) {
      console.log(`📄 Processing snippet ${snippet.id}: ${snippet.file_path}`);
      try {
        // Fetch file content using generic request (works reliably)
        const { data } = await octokit.request(
          'GET /repos/{owner}/{repo}/contents/{path}',
          {
            owner,
            repo,
            path: snippet.file_path,
            ref: `refs/heads/${branch}`,
          }
        );

        if (!('content' in data)) {
          console.log('❌ No content in file data');
          continue;
        }

        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        const lines = content.split('\n');
        const selected = lines.slice(snippet.start_line - 1, snippet.end_line).join('\n');

        const lang = snippet.language || detectLanguage(snippet.file_path);
        const html = highlighter.codeToHtml(selected, { lang, theme: 'github-dark' });

        const { error: updateError } = await supabaseAdmin
          .from('snippets')
          .update({
            rendered_html: html,
            last_synced_at: new Date().toISOString(),
            commit_sha: data.sha,
          })
          .eq('id', snippet.id);

        if (updateError) {
          console.error('🔥 Update error:', updateError);
        } else {
          console.log('✅ Snippet updated successfully');
        }

        await supabaseAdmin.from('snippet_versions').insert({
          snippet_id: snippet.id,
          rendered_html: html,
          commit_sha: data.sha,
        });
      } catch (err) {
        console.error(`💥 Sync failed for ${snippet.id}:`, err);
        await supabaseAdmin
          .from('snippets')
          .update({ status: 'error' })
          .eq('id', snippet.id);
      }
    }
  }

  return new Response('ok');
}