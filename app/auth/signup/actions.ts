"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type SignupState = {
  error?: string
  message?: string
}

export async function signup(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const supabase = await createClient()

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return {
      error: "password_mismatch",
      message: "Passwords do not match.",
    }
  }

  if (password.length < 8) {
    return {
      error: "password_too_short",
      message: "Password must be at least 8 characters long.",
    }
  }

  const data = {
    email: formData.get("email") as string,
    password: password,
    options: {
      data: {
        full_name: formData.get("name") as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    if (error.code === "user_already_exists") {
      return {
        error: "user_already_exists",
        message:
          "An account with this email already exists. Please sign in instead.",
      }
    }

    return {
      error: "unknown",
      message: error.message || "Something went wrong. Please try again.",
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
