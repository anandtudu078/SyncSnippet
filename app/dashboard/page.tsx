import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { FiGithub, FiCode, FiLayers, FiCheckCircle } from 'react-icons/fi';
import DarkModeToggle from '@/components/DarkModeToggle';
import UserMenu from '@/components/UserMenu';
import NewSnippetButton from '@/components/NewSnippetButton';

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Check existing GitHub App installations
  const { data: installations } = await supabase
    .from('installations')
    .select('id')
    .eq('owner_id', user.id);

  const hasInstallation = installations && installations.length > 0;
  const githubAppInstallUrl = `https://github.com/apps/syncbuddy/installations/new`;

  // Stats (replace with real queries later)
  const stats = {
    totalSnippets: 0,
    syncedToday: 0,
    activeRepos: installations?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <UserMenu
              email={user.email || undefined}
              userName={user.user_metadata?.user_name}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/50">
                <FiCode className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Snippets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSnippets}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/50">
                <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Synced Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.syncedToday}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/50">
                <FiGithub className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Repos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeRepos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Connection card */}
        <div className="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">GitHub Connection</h2>
              {hasInstallation ? (
                <div className="mt-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="font-medium">
                    GitHub App installed on {installations.length} account(s).
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  No repositories connected yet. Connect a GitHub repository to start syncing code snippets.
                </p>
              )}
            </div>
            <a
              href={githubAppInstallUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 active:bg-indigo-700"
            >
              <FiGithub className="h-4 w-4" />
              {hasInstallation ? 'Manage Installation' : 'Connect Repository'}
            </a>
          </div>
        </div>

        {/* Snippets placeholder */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Snippets</h2>
            <NewSnippetButton />
          </div>
          {stats.totalSnippets === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FiLayers className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No snippets yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Connect a repository and create your first snippet.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Snippet list will appear here.</p>
          )}
        </div>
      </main>
    </div>
  );
}