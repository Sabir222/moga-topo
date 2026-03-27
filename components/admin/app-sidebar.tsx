"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  IconChartBar,
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconCoin,
  IconLogout,
} from "@tabler/icons-react"
import { Link, usePathname } from "@/lib/i18n/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  locale: string
}

export function AppSidebar({ locale, ...props }: AppSidebarProps) {
  const t = useTranslations("Admin")
  const tDash = useTranslations("Dashboard")
  const pathname = usePathname()

  const navItems = [
    {
      title: t("nav.dashboard"),
      url: "/admin" as const,
      icon: IconDashboard,
    },
    {
      title: t("nav.requests"),
      url: "/admin/requests" as const,
      icon: IconListDetails,
    },
    {
      title: t("nav.users"),
      url: "/admin/users" as const,
      icon: IconUsers,
    },
    {
      title: t("nav.quota"),
      url: "/admin/quota" as const,
      icon: IconCoin,
    },
    {
      title: t("nav.analytics"),
      url: "/admin/analytics" as const,
      icon: IconChartBar,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin">
                <IconDashboard className="size-5!" />
                <span className="text-base font-semibold">
                  {t("companyName")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={`/${locale}/auth/signout`} method="post">
              <SidebarMenuButton type="submit">
                <IconLogout className="size-4" />
                <span>{tDash("signOut")}</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
