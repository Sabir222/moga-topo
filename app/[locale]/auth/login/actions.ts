"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { loginSchema } from "@/lib/validations/auth"

export type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  error?: string
  message?: string
}

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const t = await getTranslations("Errors")

  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const result = loginSchema.safeParse(raw)

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(result.data)

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        error: "email_not_confirmed",
        message: t("emailNotConfirmed"),
      }
    }

    if (error.code === "invalid_credentials") {
      return {
        error: "invalid_credentials",
        message: t("invalidCredentials"),
      }
    }

    return {
      error: "unknown",
      message: t("somethingWrong"),
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error) {
    redirect("/auth-code-error")
  }
}
