import React from "react"
import { SiteHeader } from "./SiteHeader"
import Breadcrumbs from "./Breadcrumbs"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SiteHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-7xl">
          <Breadcrumbs />
          {children}
        </div>
      </main>
    </div>
  )
}
