import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getGitHubApp } from '@/lib/github';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const installationId = searchParams.get('installation_id');

  if (!installationId) {
    return NextResponse.redirect(new URL('/dashboard?error=no_installation_id', request.url));
  }

  // Get the current user (must be logged in)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Save the installation in the database
  const { error } = await supabase
    .from('installations')
    .upsert({
      id: parseInt(installationId, 10),
      owner_id: user.id,
    });

  if (error) {
    console.error('Failed to save installation:', error);
    return NextResponse.redirect(new URL('/dashboard?error=save_failed', request.url));
  }

  // Redirect back to dashboard with success
  return NextResponse.redirect(new URL('/dashboard?installed=true', request.url));
}