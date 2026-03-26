import createMiddleware from "next-intl/middleware"
import { NextRequest } from "next/server"
import { routing } from "./lib/i18n/routing"
import { updateSession } from "./lib/supabase/middleware"

const handleI18nRouting = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  // 1. Supabase session refresh + auth check
  const supabaseResponse = await updateSession(request)

  // 2. If Supabase redirects (unauthenticated user), return that
  if (supabaseResponse.headers.get("location")) {
    return supabaseResponse
  }

  // 3. next-intl routing (locale detection, prefix handling)
  const i18nResponse = handleI18nRouting(request)

  // 4. Copy Supabase cookies to i18n response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    i18nResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  return i18nResponse
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
