import { getTranslations } from "next-intl/server"
import { db } from "@/lib/db"
import { profiles } from "@/drizzle/schema"
import { desc } from "drizzle-orm"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

export default async function AdminQuotaPage() {
  const t = await getTranslations("Admin")

  // Fetch all users with quota info
  const allUsers = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      role: profiles.role,
      monthlyQuota: profiles.monthlyQuota,
      usedQuota: profiles.usedQuota,
    })
    .from(profiles)
    .orderBy(desc(profiles.id))

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("quota.title")}</CardTitle>
          <CardDescription>{t("quota.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {allUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("quota.noUsers")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("quota.user")}</TableHead>
                  <TableHead>{t("quota.used")}</TableHead>
                  <TableHead>{t("quota.limit")}</TableHead>
                  <TableHead>{t("quota.remaining")}</TableHead>
                  <TableHead className="w-[200px]">Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => {
                  const used = user.usedQuota ?? 0
                  const limit = user.monthlyQuota ?? 5
                  const remaining = Math.max(0, limit - used)
                  const percentage = limit > 0 ? (used / limit) * 100 : 0

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name ?? "Unknown"}
                      </TableCell>
                      <TableCell>{used}</TableCell>
                      <TableCell>{limit}</TableCell>
                      <TableCell>{remaining}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="h-2" />
                          <span className="text-xs text-muted-foreground">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
