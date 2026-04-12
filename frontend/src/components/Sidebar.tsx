import { 
  LayoutDashboard, 
  Users, 
  PawPrint, 
  Stethoscope, 
  CreditCard, 
  Settings, 
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LanguageSwitcher from "./LanguageSwitcher"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", role: "any" },
  { icon: Users, label: "Clients", path: "/clients", role: "any" },
  { icon: PawPrint, label: "Patients", path: "/patients", role: "any" },
  { icon: Stethoscope, label: "Consultations", path: "/consultations", role: "vet" },
  { icon: CreditCard, label: "Billing", path: "/billing", role: "admin" },
  { icon: Settings, label: "Settings", path: "/settings", role: "tech" },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <aside className="hidden border-r bg-muted/40 lg:block lg:w-64 lg:shrink-0">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              V
            </div>
            <span>VetOS</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "justify-start gap-3 h-10 px-3",
                  location.pathname === item.path && "bg-secondary"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t bg-muted/20">
          <div className="flex flex-col gap-4">
            <LanguageSwitcher />
            
            <Separator />
            
            <div className="flex items-center gap-3 px-2 py-1">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">SA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">System Admin</span>
                <span className="text-xs text-muted-foreground truncate">admin@vetos.ch</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
