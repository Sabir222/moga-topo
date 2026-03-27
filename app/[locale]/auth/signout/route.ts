import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath("/", "layout")

  // Extract locale from URL (e.g., /ar/auth/signout -> ar)
  const url = new URL(req.url)
  const localeMatch = url.pathname.match(/^\/([a-z]{2})\//)
  const locale = localeMatch ? localeMatch[1] : "ar"

  return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url), {
    status: 302,
  })
}
