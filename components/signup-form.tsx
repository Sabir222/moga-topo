"use client"

import { useActionState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/i18n/navigation"
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
import { signup, signInWithGoogle } from "@/app/[locale]/auth/signup/actions"

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
      {message}
    </div>
  )
}

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [state, formAction, isPending] = useActionState(signup, {})
  const t = useTranslations("Auth")

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{t("signUpTitle")}</CardTitle>
        <CardDescription>{t("signUpDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            {state?.error && <ErrorMessage message={state.message!} />}
            <Field>
              <FieldLabel htmlFor="name">{t("fullName")}</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                aria-invalid={!!state?.errors?.name}
              />
              {state?.errors?.name && (
                <FieldError>{state.errors.name[0]}</FieldError>
              )}
            </Field>
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
              <FieldDescription>{t("emailHint")}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                aria-invalid={!!state?.errors?.password}
              />
              {state?.errors?.password && (
                <FieldError>{state.errors.password[0]}</FieldError>
              )}
              <FieldDescription>{t("passwordHint")}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                {t("confirmPassword")}
              </FieldLabel>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                aria-invalid={!!state?.errors?.confirmPassword}
              />
              {state?.errors?.confirmPassword && (
                <FieldError>{state.errors.confirmPassword[0]}</FieldError>
              )}
              <FieldDescription>{t("confirmHint")}</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? t("creatingAccount") : t("createAccount")}
                </Button>
                <Button formAction={signInWithGoogle} variant="outline">
                  {t("signUpWithGoogle")}
                </Button>
                <FieldDescription className="px-6 text-center">
                  {t("haveAccount")}{" "}
                  <Link href="/auth/login" className="underline">
                    {t("signIn")}
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
