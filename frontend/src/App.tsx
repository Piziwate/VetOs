import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "./i18n"
import { ThemeProvider } from "./components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import Login from "./pages/Login"
import ClientList from "./components/ClientList"
import Layout from "./components/Layout"
import { 
  Users, 
  PawPrint, 
  CreditCard, 
  Activity, 
  ArrowUpRight,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
                  <div className="flex flex-col gap-8">
                    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                      <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {t('dashboard.stats.total_clients')}
                          </CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">1,284</div>
                          <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {t('dashboard.stats.patients')}
                          </CardTitle>
                          <PawPrint className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">+235</div>
                          <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">{t('dashboard.stats.revenue')}</CardTitle>
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">CHF 12,234.19</div>
                          <p className="text-xs text-muted-foreground">
                            +19% from last month
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {t('dashboard.stats.visits')}
                          </CardTitle>
                          <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">+573</div>
                          <p className="text-xs text-muted-foreground">
                            +201 since last hour
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                      <Card className="xl:col-span-2 shadow-sm">
                        <CardHeader className="flex flex-row items-center">
                          <div className="grid gap-2">
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>
                              Recent transactions from your practice.
                            </CardDescription>
                          </div>
                          <Button asChild size="sm" className="ml-auto gap-1">
                            <Link to="/billing">
                              View All
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                            Transaction chart or table placeholder
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>{t('dashboard.stats.quick_actions')}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <Plus className="h-4 w-4" />
                            {t('dashboard.stats.register_patient')}
                          </Button>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <Plus className="h-4 w-4" />
                            {t('dashboard.add_client')}
                          </Button>
                          <div className="flex items-center gap-4 mt-4">
                            <Badge variant="secondary" className="px-2 py-1">New</Badge>
                            <p className="text-sm text-muted-foreground">
                              System update v0.1.2 is now available.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
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
            <Route path="/patients" element={<ProtectedRoute><div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">Patients Management Coming Soon</div></ProtectedRoute>} />
            <Route path="/consultations" element={<ProtectedRoute><div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">Consultations Management Coming Soon</div></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">Billing Management Coming Soon</div></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">Settings Coming Soon</div></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
