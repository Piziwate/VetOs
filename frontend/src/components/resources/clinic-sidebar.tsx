import { Building2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { Clinic } from "@/types/resource"

interface ClinicSidebarProps {
  clinics: Clinic[]
  activeClinicId: number | undefined
  onSelectClinic: (clinic: Clinic) => void
}

export const ClinicSidebar = ({ clinics, activeClinicId, onSelectClinic }: ClinicSidebarProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider px-2">
          {t("resources.sites_group")}
        </p>
        <div className="space-y-1">
          {clinics.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectClinic(c)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                activeClinicId === c.id 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
