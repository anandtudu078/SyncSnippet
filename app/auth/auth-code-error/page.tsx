export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-2 text-gray-600">
          Something went wrong during sign‑in. Please try again.
        </p>
        <a href="/login" className="mt-4 inline-block text-indigo-600 underline">
          Back to login
        </a>
      </div>
    </div>
  );
}