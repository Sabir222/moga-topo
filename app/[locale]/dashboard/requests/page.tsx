import { createClient } from "@/lib/supabase/server"
import { getTranslations, getLocale } from "next-intl/server"
import { redirect } from "@/lib/i18n/navigation"
import { db } from "@/lib/db"
import { requests } from "@/drizzle/schema"
import { eq, desc } from "drizzle-orm"

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

export default async function ClientRequestsPage() {
  const tAdmin = await getTranslations("Admin")
  const locale = await getLocale()
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: "/auth/login", locale })
  }

  const userRequests = await db
    .select({
      id: requests.id,
      status: requests.status,
      area: requests.area,
      notes: requests.notes,
      createdAt: requests.createdAt,
    })
    .from(requests)
    .where(eq(requests.userId, user!.id))
    .orderBy(desc(requests.createdAt))

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>{tAdmin("requests.title")}</CardTitle>
          <CardDescription>{tAdmin("requests.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {userRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {tAdmin("requests.noRequests")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tAdmin("requests.id")}</TableHead>
                  <TableHead>{tAdmin("requests.status")}</TableHead>
                  <TableHead>{tAdmin("requests.area")}</TableHead>
                  <TableHead>{tAdmin("requests.created")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs">
                      {req.id.slice(0, 8)}...
                    </TableCell>
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
