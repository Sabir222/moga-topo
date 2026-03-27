import { getTranslations } from "next-intl/server"
import { db } from "@/lib/db"
import { requests, profiles } from "@/drizzle/schema"
import { count, eq } from "drizzle-orm"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconListDetails,
  IconClock,
  IconCircleCheck,
  IconUsers,
} from "@tabler/icons-react"

export default async function AdminPage() {
  const t = await getTranslations("Admin")

  // Get stats
  const totalRequests = await db.select({ count: count() }).from(requests)
  const pendingRequests = await db
    .select({ count: count() })
    .from(requests)
    .where(eq(requests.status, "pending"))
  const completedRequests = await db
    .select({ count: count() })
    .from(requests)
    .where(eq(requests.status, "completed"))
  const totalUsers = await db.select({ count: count() }).from(profiles)

  const stats = [
    {
      title: t("stats.totalRequests"),
      value: totalRequests[0]?.count ?? 0,
      icon: IconListDetails,
    },
    {
      title: t("stats.pendingRequests"),
      value: pendingRequests[0]?.count ?? 0,
      icon: IconClock,
    },
    {
      title: t("stats.completedRequests"),
      value: completedRequests[0]?.count ?? 0,
      icon: IconCircleCheck,
    },
    {
      title: t("stats.totalUsers"),
      value: totalUsers[0]?.count ?? 0,
      icon: IconUsers,
    },
  ]

  return (
    <div className="px-4 lg:px-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
