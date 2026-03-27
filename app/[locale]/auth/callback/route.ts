import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin, pathname } = new URL(request.url)
  const code = searchParams.get("code")

  // Extract locale from URL (e.g., /ar/auth/callback -> ar)
  const localeMatch = pathname.match(/^\/([a-z]{2})\//)
  const locale = localeMatch ? localeMatch[1] : "ar"

  let next = searchParams.get("next") ?? `/${locale}/dashboard`
  if (!next.startsWith("/")) {
    next = `/${locale}/dashboard`
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/auth-code-error`)
}
