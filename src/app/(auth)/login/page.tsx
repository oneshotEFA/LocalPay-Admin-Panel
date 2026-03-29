export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-slate-300">
          Use your API key or email / password to access the portal.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium">
            Sign in with API key
          </button>
          <button className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium">
            Sign in with Email & Password
          </button>
        </div>
      </div>
    </div>
  );
}
