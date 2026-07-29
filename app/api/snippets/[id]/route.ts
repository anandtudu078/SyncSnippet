import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Optional GET for widget (already exists)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: snippet } = await supabase
    .from('snippets')
    .select('rendered_html, last_synced_at')
    .eq('id', id)
    .single();
  if (!snippet) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ html: snippet.rendered_html, lastSynced: snippet.last_synced_at }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600' },
  });
}

// PUT – update snippet
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: snippet } = await supabase
    .from('snippets')
    .select('owner_id')
    .eq('id', id)
    .single();

  if (!snippet) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (snippet.owner_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { start_line, end_line, branch } = body;

  const { error } = await supabase
    .from('snippets')
    .update({ start_line, end_line, branch })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// DELETE – remove snippet
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: snippet } = await supabase
    .from('snippets')
    .select('owner_id')
    .eq('id', id)
    .single();

  if (!snippet) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (snippet.owner_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { error } = await supabase.from('snippets').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}