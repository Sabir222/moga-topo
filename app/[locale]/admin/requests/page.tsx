import { getTranslations } from "next-intl/server"
import { db } from "@/lib/db"
import { requests, profiles } from "@/drizzle/schema"
import { desc, eq } from "drizzle-orm"

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
import { Badge } from "@/components/ui/badge"

function getStatusColor(status: string | null) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "approved":
      return "bg-blue-100 text-blue-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "completed":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default async function AdminRequestsPage() {
  const t = await getTranslations("Admin")

  // Fetch all requests with user info
  const allRequests = await db
    .select({
      id: requests.id,
      status: requests.status,
      area: requests.area,
      notes: requests.notes,
      createdAt: requests.createdAt,
      userName: profiles.name,
    })
    .from(requests)
    .leftJoin(profiles, eq(requests.userId, profiles.id))
    .orderBy(desc(requests.createdAt))

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("requests.title")}</CardTitle>
          <CardDescription>{t("requests.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {allRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("requests.noRequests")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("requests.id")}</TableHead>
                  <TableHead>{t("requests.user")}</TableHead>
                  <TableHead>{t("requests.status")}</TableHead>
                  <TableHead>{t("requests.area")}</TableHead>
                  <TableHead>{t("requests.created")}</TableHead>
                  <TableHead>{t("requests.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs">
                      {req.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{req.userName ?? "Unknown"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(req.status)}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {req.area ? `${req.area.toFixed(2)} m²` : "-"}
                    </TableCell>
                    <TableCell>
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <button className="text-sm text-blue-600 hover:underline">
                        {t("requests.view")}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
