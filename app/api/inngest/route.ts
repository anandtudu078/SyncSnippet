import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { syncSnippetOnPush } from '@/jobs/syncSnippet';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncSnippetOnPush],
});