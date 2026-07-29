'use client'

import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black dark:from-gray-900 dark:via-black dark:to-black">
      {/* Neon card */}
      <div className="w-full max-w-sm rounded-2xl border border-indigo-500/30 bg-[rgba(17,17,17,0.9)] p-10 text-center shadow-[0_0_30px_rgba(99,102,241,0.15)] animate-[fadeInUp_0.6s_ease-out]">
        {/* Icon */}
        <div className="mb-4 text-6xl">💠</div>

        {/* Heading with neon glow */}
        <h2 className="mb-2 text-3xl font-bold text-white [text-shadow:0_0_10px_rgba(99,102,241,0.5)]">
          SyncSnippet
        </h2>
        <p className="mb-8 text-gray-400">
          Code that stays in sync
        </p>

        {/* GitHub sign-in form */}
        <form action={login}>
          <button
            type="submit"
            className="group relative w-full rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] hover:scale-[1.02]"
          >
            <span className="flex items-center justify-center gap-3">
              {/* GitHub SVG */}
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </span>
          </button>
        </form>
      </div>

      {/* Custom keyframe for entrance */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}