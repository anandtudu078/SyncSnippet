import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { FiGithub, FiCode, FiLayers, FiCheckCircle, FiBell, FiClock } from 'react-icons/fi';
import DarkModeToggle from '@/components/DarkModeToggle';
import UserMenu from '@/components/UserMenu';
import NewSnippetButton from '@/components/NewSnippetButton';
import AnimatedCounter from '@/components/AnimatedCounter';
import HistoryList from '@/components/HistoryList';
import NotificationBell from '@/components/NotificationBell';
import FreeTierBar from '@/components/FreeTierBar';            // ← new
import DashboardWrapper from '@/components/DashboardWrapper';  // ← new

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: installations } = await supabase
    .from('installations')
    .select('id')
    .eq('owner_id', user.id);

  const hasInstallation = installations && installations.length > 0;
  const githubAppInstallUrl = `https://github.com/apps/syncbuddy/installations/new`;

  const { data: snippets } = await supabase
    .from('snippets')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const totalSnippets = snippets?.length ?? 0;
  const syncedToday = 0;

  const stats = {
    totalSnippets,
    syncedToday,
    activeRepos: installations?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <header className="border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
              v0.1
            </span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <DarkModeToggle />
            <UserMenu email={user.email || undefined} userName={user.user_metadata?.user_name} />
          </div>
        </div>
      </header>

      {/* Main content wrapped in animated container */}
      <DashboardWrapper>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Stats cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Snippets */}
            <div className="animate-fade-in-up [animation-delay:0.1s] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/50">
                  <FiCode className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Snippets</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter target={stats.totalSnippets} />
                  </p>
                </div>
              </div>
            </div>

            {/* Synced Today */}
            <div className="animate-fade-in-up [animation-delay:0.2s] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/50">
                  <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Synced Today</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter target={stats.syncedToday} />
                  </p>
                </div>
              </div>
            </div>

            {/* Active Repos */}
            <div className="animate-fade-in-up [animation-delay:0.3s] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/50">
                  <FiGithub className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Repos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter target={stats.activeRepos} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Connection card */}
          <div className="animate-fade-in-up [animation-delay:0.4s] mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
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
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-95"
              >
                <FiGithub className="h-4 w-4" />
                {hasInstallation ? 'Manage Installation' : 'Connect Repository'}
              </a>
            </div>
          </div>

          {/* Quick New Snippet + Free tier progress bar */}
          <div className="animate-fade-in-up [animation-delay:0.5s] mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Snippets</h2>
              <NewSnippetButton />
            </div>
            {totalSnippets === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FiLayers className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No snippets yet.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Connect a repository and create your first snippet.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Manage your snippets below. You can create up to 5 on the free plan.
                </p>
                <FreeTierBar used={totalSnippets} />
              </div>
            )}
          </div>

          {/* Snippet History */}
          <div className="animate-fade-in-up [animation-delay:0.6s] mt-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiClock className="h-5 w-5 text-indigo-500" />
                Snippet History
              </h2>
            </div>
            <HistoryList snippets={snippets || []} />
          </div>
        </main>
      </DashboardWrapper>
    </div>
  );
}