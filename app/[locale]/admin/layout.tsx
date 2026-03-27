import { redirect } from "@/lib/i18n/navigation"
import { getLocale } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { profiles } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

import { AppSidebar } from "@/components/admin/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

type Props = {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: Props) {
  const locale = await getLocale()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: "/auth/login", locale })
  }

  // Check if user is admin
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user!.id))
    .limit(1)

  if (!profile[0] || profile[0].role !== "admin") {
    redirect({ href: "/dashboard", locale })
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
      <AppSidebar
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
