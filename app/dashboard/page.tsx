import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Check if user already has any installations
  const { data: installations } = await supabase
    .from('installations')
    .select('id')
    .eq('owner_id', user.id);

  const githubAppInstallUrl = `https://github.com/apps/syncsnippet-dev/installations/new`; // Replace with your GitHub App name slug

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {user.email}</p>

      {/* Connection status */}
      <div className="mb-8 p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">GitHub Connection</h2>
        {installations && installations.length > 0 ? (
          <div className="flex items-center gap-2 text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span>GitHub App installed on {installations.length} account(s).</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-gray-500">No repositories connected yet.</p>
            <a
              href={githubAppInstallUrl}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-500 transition w-fit"
            >
              Connect GitHub Repository
            </a>
          </div>
        )}
      </div>

      {/* Future: snippet list will go here */}
    </div>
  );
}