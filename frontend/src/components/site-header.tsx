import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { PanelLeft, Building2, ChevronDown } from "lucide-react"

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
import { useSettings } from "@/hooks/use-settings"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const { clinics, activeClinic, setActiveClinic } = useSettings()
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
        
        <Separator orientation="vertical" className="mx-2 h-4 hidden sm:block" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-2 h-8 font-semibold text-primary hover:bg-primary/5 focus-visible:ring-0">
              <Building2 className="h-4 w-4" />
              <span className="hidden md:inline">{activeClinic?.name || "Sélectionner un site"}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Passer à un autre site</div>
            {clinics.map((clinic) => (
              <DropdownMenuItem 
                key={clinic.id} 
                onClick={() => setActiveClinic(clinic)}
                className={`flex flex-col items-start gap-0.5 py-2 cursor-pointer ${activeClinic?.id === clinic.id ? "bg-accent" : ""}`}
              >
                <span className="font-bold">{clinic.name}</span>
                <span className="text-[10px] text-muted-foreground truncate w-full">{clinic.address || "Pas d'adresse renseignée"}</span>
              </DropdownMenuItem>
            ))}
            {clinics.length === 0 && (
              <DropdownMenuItem disabled>Aucun site configuré</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
