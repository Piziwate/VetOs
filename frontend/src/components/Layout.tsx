import React from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { ThemeToggle } from "./ThemeToggle"
import Breadcrumbs from "./Breadcrumbs"
import { CommandMenu } from "./CommandMenu"
import { Separator } from "./ui/separator"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-background overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-card/50 backdrop-blur sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
              <div className="hidden sm:block">
                <Breadcrumbs />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <CommandMenu />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
            <div className="mx-auto w-full max-w-7xl h-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
