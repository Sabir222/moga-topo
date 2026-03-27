"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "@/lib/i18n/navigation"
import { getTranslations, getLocale } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { signupSchema } from "@/lib/validations/auth"

export type SignupState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  error?: string
  message?: string
}

export async function signup(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const t = await getTranslations("Errors")
  const locale = await getLocale()

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  const result = signupSchema.safeParse(raw)

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.name,
      },
    },
  })

  if (error) {
    if (error.code === "user_already_exists") {
      return {
        error: "user_already_exists",
        message: t("userAlreadyExists"),
      }
    }

    return {
      error: "unknown",
      message: t("somethingWrong"),
    }
  }

  revalidatePath("/", "layout")
  redirect({ href: "/dashboard", locale })
  // TypeScript doesn't know redirect throws, so we need this
  return prevState
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const locale = await getLocale()

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error) {
    redirect({ href: "/auth-code-error", locale })
  }
}
