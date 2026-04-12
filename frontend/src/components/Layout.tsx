import React from "react"
import Sidebar from "./Sidebar"
import { ThemeToggle } from "./ThemeToggle"
import { useTranslation } from "react-i18next"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen w-full bg-background font-sans antialiased">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b px-8 bg-card shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              VetOS
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
