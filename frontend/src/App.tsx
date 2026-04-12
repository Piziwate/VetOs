import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import ClientList from "./components/ClientList"

// Simple component to protect routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Router>
      <main className="container mx-auto py-10 px-4 min-h-screen">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            VetOS
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Modern Veterinary Practice Management
          </p>
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
