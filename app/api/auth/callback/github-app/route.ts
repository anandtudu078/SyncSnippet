import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// Admin client that bypasses RLS
const supabaseAdmin = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const installationId = searchParams.get('installation_id');
  console.log('Callback received installation_id:', installationId);

  if (!installationId) {
    return NextResponse.redirect(new URL('/dashboard?error=no_installation_id', request.url));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('No user – redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('User found:', user.id, user.email);

  // 1. Ensure profile exists (use admin client to bypass RLS, but user-specific)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: user.id,
      github_username: user.user_metadata?.user_name || '',
      plan: 'free',
    });
  if (profileError) {
    console.error('Profile upsert error:', profileError);
  } else {
    console.log('Profile upsert successful or already exists');
  }

  // 2. Save the installation (use admin client to bypass RLS)
  const numericId = parseInt(installationId, 10);
  const { error: installError } = await supabaseAdmin
    .from('installations')
    .upsert({
      id: numericId,
      owner_id: user.id,
    });

  if (installError) {
    console.error('Installation insert error:', installError);
    return NextResponse.redirect(new URL('/dashboard?error=save_failed', request.url));
  }

  console.log('Installation saved successfully:', numericId);
  return NextResponse.redirect(new URL('/dashboard?installed=true', request.url));
}