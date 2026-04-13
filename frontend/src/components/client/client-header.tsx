import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ChevronLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ClientHeaderProps {
  name: string
  isActive: boolean
  legacyId: string
}

export const ClientHeader = ({ name, isActive, legacyId }: ClientHeaderProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <Link to="/clients" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
          <ChevronLeft className="h-4 w-4" />
          {t("client_detail.back")}
        </Link>
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">{name}</h2>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? t("client_detail.active") : t("client_detail.inactive")}
          </Badge>
        </div>
        <p className="text-muted-foreground font-mono text-sm">
          {t("client_detail.legacy_id")}: {legacyId}
        </p>
      </div>
    </div>
  )
}
