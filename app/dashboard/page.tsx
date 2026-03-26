import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded border px-4 py-2 hover:bg-gray-50"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Welcome, {user.email}</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>User ID: {user.id}</p>
            <p>Provider: {user.app_metadata.provider ?? "email"}</p>
            <p>
              Last sign in:{" "}
              {new Date(user.last_sign_in_at ?? "").toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Your Requests</h2>
          <p className="text-gray-500">
            No requests yet. Start by creating a new land measurement request.
          </p>
        </div>
      </div>
    </div>
  )
}
