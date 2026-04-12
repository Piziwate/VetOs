import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "./i18n"  // Import i18n configuration
import Login from "./pages/Login"
import ClientList from "./components/ClientList"
import LanguageSwitcher from "./components/LanguageSwitcher"

// Simple component to protect routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function App() {
  const { t } = useTranslation()

  return (
    <Router>
      <main className="container mx-auto py-10 px-4 min-h-screen">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {t('app_name')}
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            {t('tagline')}
          </p>
          <LanguageSwitcher />
        </header>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <div className="flex flex-col gap-8">
                  <ClientList />
                </div>
              </ProtectedRoute>
            } 
          />
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
