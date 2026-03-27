"use client"

import { useActionState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/i18n/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { login, signInWithGoogle } from "@/app/[locale]/auth/login/actions"

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
      {message}
    </div>
  )
}

function InfoMessage({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-600">
      {message}
    </div>
  )
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = useActionState(login, {})
  const t = useTranslations("Auth")

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t("loginTitle")}</CardTitle>
          <CardDescription>{t("loginDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              {state?.error === "email_not_confirmed" && (
                <InfoMessage message={state.message!} />
              )}
              {state?.error && state.error !== "email_not_confirmed" && (
                <ErrorMessage message={state.message!} />
              )}
              <Field>
                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={!!state?.errors?.email}
                />
                {state?.errors?.email && (
                  <FieldError>{state.errors.email[0]}</FieldError>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  aria-invalid={!!state?.errors?.password}
                />
                {state?.errors?.password && (
                  <FieldError>{state.errors.password[0]}</FieldError>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? t("loggingIn") : t("loginButton")}
                </Button>
                <Button formAction={signInWithGoogle} variant="outline">
                  {t("loginWithGoogle")}
                </Button>
                <FieldDescription className="text-center">
                  {t("noAccount")}{" "}
                  <Link href="/auth/signup" className="underline">
                    {t("signUp")}
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
