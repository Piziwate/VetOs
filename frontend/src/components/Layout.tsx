import React from "react"
import Sidebar from "./Sidebar"
import { ThemeToggle } from "./ThemeToggle"
import { useTranslation } from "react-i18next"
import Breadcrumbs from "./Breadcrumbs"
import { CommandMenu } from "./CommandMenu"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen w-full bg-background font-sans antialiased">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b px-8 bg-card shadow-sm shrink-0">
          <div className="flex items-center gap-8">
            <h2 className="text-lg font-bold tracking-tight text-primary hidden md:block">
              VetOS
            </h2>
            <CommandMenu />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
