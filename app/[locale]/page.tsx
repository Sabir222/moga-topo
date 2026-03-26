import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"

export default async function Page() {
  const t = await getTranslations("Home")

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p>{t("description")}</p>
          <Button className="mt-2">{t("getStarted")}</Button>
        </div>
      </div>
    </div>
  )
}
