import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function AuthCodeError() {
  const t = await getTranslations("AuthError")

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-gray-500">{t("description")}</p>
        <Link href="/ar/auth/login" className="inline-block underline">
          {t("backToLogin")}
        </Link>
      </div>
    </div>
  )
}
