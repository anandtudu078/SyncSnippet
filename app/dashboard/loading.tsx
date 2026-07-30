export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats skeletons */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-6 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub Connection skeleton */}
        <div className="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-9 w-40 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Snippets skeleton */}
        <div className="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-9 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="space-y-3">
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </main>
    </div>
  )
}