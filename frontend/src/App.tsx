import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "./i18n"
import { ThemeProvider } from "./components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import Login from "./pages/Login"
import ClientList from "./components/ClientList"
import Layout from "./components/Layout"
import { Users, PawPrint, CreditCard, Activity } from "lucide-react"

// Simple component to protect routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Layout>{children}</Layout>
}

function App() {
  const { t } = useTranslation()

  return (
    <ThemeProvider defaultTheme="light" storageKey="vetos-ui-theme">
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl border bg-card p-6 shadow-sm ring-1 ring-border/5">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('dashboard.stats.total_clients')}</p>
                            <h3 className="text-2xl font-bold">1,284</h3>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                          <Activity className="h-3 w-3 mr-1" /> +12% from last month
                        </div>
                      </div>
                      
                      <div className="rounded-xl border bg-card p-6 shadow-sm ring-1 ring-border/5">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary">
                            <PawPrint className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('dashboard.stats.patients')}</p>
                            <h3 className="text-2xl font-bold">3,450</h3>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                          <Activity className="h-3 w-3 mr-1" /> +5% new records
                        </div>
                      </div>

                      <div className="rounded-xl border bg-card p-6 shadow-sm ring-1 ring-border/5">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('dashboard.stats.revenue')}</p>
                            <h3 className="text-2xl font-bold">CHF 12.5k</h3>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-red-600 font-medium">
                          <Activity className="h-3 w-3 mr-1" /> -2% vs target
                        </div>
                      </div>

                      <div className="rounded-xl border bg-card p-6 shadow-sm ring-1 ring-border/5">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary">
                            <Activity className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('dashboard.stats.visits')}</p>
                            <h3 className="text-2xl font-bold">18</h3>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-muted-foreground font-medium">
                          Next appointment at 14:30
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                      <div className="col-span-4 rounded-xl border bg-card shadow-sm p-6">
                        <h3 className="font-semibold mb-4">{t('dashboard.stats.activity')}</h3>
                        <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                          Activity chart placeholder
                        </div>
                      </div>
                      <div className="col-span-3 rounded-xl border bg-card shadow-sm p-6">
                        <h3 className="font-semibold mb-4">{t('dashboard.stats.quick_actions')}</h3>
                        <div className="space-y-4">
                          <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm">
                              <PawPrint className="h-4 w-4 text-primary" />
                              <span>{t('dashboard.stats.register_patient')}</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">N P</span>
                          </div>
                          <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm">
                              <Users className="h-4 w-4 text-primary" />
                              <span>{t('dashboard.add_client')}</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">N C</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/clients" 
              element={
                <ProtectedRoute>
                  <ClientList />
                </ProtectedRoute>
              } 
            />

            {/* Fallback routes */}
            <Route path="/patients" element={<ProtectedRoute><div>Patients Management Coming Soon</div></ProtectedRoute>} />
            <Route path="/consultations" element={<ProtectedRoute><div>Consultations Management Coming Soon</div></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><div>Billing Management Coming Soon</div></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><div>Settings Coming Soon</div></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
