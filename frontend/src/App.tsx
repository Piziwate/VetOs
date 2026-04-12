import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import "./i18n"

// Pages
import { Dashboard } from "./pages/dashboard"
import { Clients } from "./pages/clients"
import { ClientDetail } from "./pages/client-detail"
import { Login } from "./pages/login"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return (
    <div className="[--header-height:calc(var(--spacing)*14)]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <main className="flex-1 flex flex-col gap-4 p-4 lg:p-6 @container/main">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/clients" 
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/clients/:id" 
              element={
                <ProtectedRoute>
                  <ClientDetail />
                </ProtectedRoute>
              } 
            />

            {/* Placeholder routes */}
            <Route path="/patients" element={<ProtectedRoute><div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">Patients Management Coming Soon</div></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">Billing Management Coming Soon</div></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">Settings Coming Soon</div></ProtectedRoute>} />
            <Route path="/consultations" element={<ProtectedRoute><div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">Consultations Coming Soon</div></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">Statistics Coming Soon</div></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
