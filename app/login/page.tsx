<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SyncSnippet – Simple Login</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .animate-fade-in-up {
      animation: fadeInUp 0.7s ease-out forwards;
      opacity: 0;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors">
  <!-- Login card -->
  <div class="animate-fade-in-up w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
    <!-- Logo & heading -->
    <div class="mb-6 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/25">
        &lt;/&gt;
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Sign in to continue to SyncSnippet
      </p>
    </div>

    <!-- Sign in button (demo – not functional) -->
    <button
      class="group relative w-full overflow-hidden rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-[0.98]"
      onclick="alert('This is a design demo. The real button starts GitHub OAuth.')"
    >
      <span class="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-500 group-hover:translate-x-full"></span>
      <span class="relative flex items-center justify-center gap-3">
        <!-- GitHub icon -->
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        Sign in with GitHub
      </span>
    </button>

    <p class="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
      By signing in, you agree to our Terms of Service and Privacy Policy.
    </p>
  </div>
</body>
</html>