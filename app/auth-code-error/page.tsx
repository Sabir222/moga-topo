export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="text-gray-500">
          Sorry, something went wrong during authentication.
        </p>
        <a href="/auth/login" className="inline-block underline">
          Back to login
        </a>
      </div>
    </div>
  )
}
