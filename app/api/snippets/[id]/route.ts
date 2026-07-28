import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { data: snippet } = await supabase
    .from('snippets')
    .select('rendered_html, last_synced_at')
    .eq('id', params.id)
    .single();

  if (!snippet) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(
    {
      html: snippet.rendered_html,
      lastSynced: snippet.last_synced_at,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600',
      },
    }
  );
}