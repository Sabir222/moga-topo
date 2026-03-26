import { login, signup, signInWithGoogle } from "./actions"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-500">
            Enter your email to sign in or create an account
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded border px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded border px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          <div className="flex gap-2">
            <button
              formAction={login}
              className="flex-1 rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="flex-1 rounded border px-4 py-2 hover:bg-gray-50"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <form>
          <button
            formAction={signInWithGoogle}
            className="w-full rounded border px-4 py-2 hover:bg-gray-50"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  )
}
