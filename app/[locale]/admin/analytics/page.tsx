import { getTranslations } from "next-intl/server"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconChartBar } from "@tabler/icons-react"

export default async function AdminAnalyticsPage() {
  const t = await getTranslations("Admin")

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("analytics.title")}</CardTitle>
          <CardDescription>{t("analytics.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <IconChartBar className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              {t("analytics.comingSoon")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("analytics.comingSoonDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
