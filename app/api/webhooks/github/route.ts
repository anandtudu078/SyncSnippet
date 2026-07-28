import { Webhooks } from '@octokit/webhooks';
import { inngest } from '@/lib/inngest';

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

export async function POST(req: Request) {
  const signature = req.headers.get('x-hub-signature-256') ?? '';
  const body = await req.text();

  if (!webhooks.verify(body, signature)) {
    return new Response('Forbidden', { status: 403 });
  }

  const event = JSON.parse(body);
  if (event.zen) return new Response('pong'); // ping

  if (event.ref?.startsWith('refs/heads/') && event.commits?.length > 0) {
    const branch = event.ref.replace('refs/heads/', '');
    const repoFullName = event.repository.full_name;
    const installationId = event.installation.id;

    // Send to Inngest for background processing
    await inngest.send({
      name: 'github/push',
      data: { repoFullName, branch, installationId },
    });
  }

  return new Response('ok');
}