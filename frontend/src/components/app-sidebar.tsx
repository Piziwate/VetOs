import * as React from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  PawPrint,
  CreditCard,
  Settings2,
  LifeBuoy,
  Send,
  FileText,
  PieChart,
  Building2
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useSettings } from "@/hooks/use-settings"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const { getSetting } = useSettings()

  const practiceName = getSetting("practice_name")
  const practiceWebsite = getSetting("practice_website")
  const displayName = practiceName || t("app_name")

  const data = {
    user: {
      name: "Admin",
      email: "admin@vetos.ch",
      avatar: "",
    },
    navMain: [
      {
        title: t("menu.dashboard"),
        url: "/",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: t("menu.clients"),
        url: "/clients",
        icon: Users,
      },
      {
        title: t("menu.patients"),
        url: "/patients",
        icon: PawPrint,
      },
      {
        title: t("menu.billing"),
        url: "/billing",
        icon: CreditCard,
      },
      {
        title: t("menu.settings"),
        url: "/settings",
        icon: Settings2,
      },
      {
        title: "Ressources",
        url: "/resources",
        icon: Building2,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: practiceWebsite ? `${practiceName || "Clinique"} Website` : "Feedback",
        url: practiceWebsite || "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: t("menu.consultations"),
        url: "/consultations",
        icon: FileText,
      },
      {
        name: "Statistiques",
        url: "/stats",
        icon: PieChart,
      },
    ],
  }

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <PawPrint className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium uppercase tracking-wider">{displayName}</span>
                  <span className="truncate text-xs">{practiceName ? "Veterinary OS" : "Practice Management"}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
