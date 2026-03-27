import { redirect } from "@/lib/i18n/navigation"
import { getLocale } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { profiles } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

import { ClientSidebar } from "@/components/client/client-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

type Props = {
  children: React.ReactNode
}

export default async function ClientDashboardLayout({ children }: Props) {
  const locale = await getLocale()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: "/auth/login", locale })
  }

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user!.id))
    .limit(1)

  if (!profile[0] || profile[0].role === "admin") {
    redirect({ href: "/admin", locale })
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <ClientSidebar
        variant="inset"
        locale={locale}
        side={locale === "ar" ? "right" : "left"}
      />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
