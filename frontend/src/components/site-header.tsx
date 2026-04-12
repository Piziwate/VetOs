import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { PanelLeft } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const location = useLocation()
  const { t } = useTranslation()
  const pathnames: string[] = location.pathname.split("/").filter((x: string) => x)

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <PanelLeft />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              {pathnames.length === 0 ? (
                <BreadcrumbPage>{t("menu.dashboard")}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to="/">{t("menu.dashboard")}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {pathnames.map((value: string, index: number) => {
              const last = index === pathnames.length - 1
              const to = `/${pathnames.slice(0, index + 1).join("/")}`
              const label = t(`menu.${value}`, value.charAt(0).toUpperCase() + value.slice(1)) as string

              return (
                <React.Fragment key={to}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {last ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={to}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  )
}