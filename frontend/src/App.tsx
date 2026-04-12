import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "./i18n"
import { ThemeProvider } from "./components/theme-provider"
import Login from "./pages/Login"
import ClientList from "./components/ClientList"
import Layout from "./components/Layout"

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
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <div className="space-y-6">
                  <header>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                      Welcome to your practice overview.
                    </p>
                  </header>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Placeholder stats cards for "pop" effect */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                      <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                      <h3 className="text-2xl font-bold mt-2">--</h3>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                      <p className="text-sm font-medium text-muted-foreground">Patients Active</p>
                      <h3 className="text-2xl font-bold mt-2">--</h3>
                    </div>
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                      <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
                      <h3 className="text-2xl font-bold mt-2">--</h3>
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
    </ThemeProvider>
  )
}

export default App
