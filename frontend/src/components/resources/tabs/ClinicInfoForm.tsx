import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Clinic } from "@/types/resource"

interface ClinicInfoFormProps {
  clinic: Clinic
  onUpdateField: (field: keyof Clinic, value: Clinic[keyof Clinic]) => void
  onDelete: () => void
}

export const ClinicInfoForm = ({ clinic, onUpdateField, onDelete }: ClinicInfoFormProps) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg">{t("resources.general.site_info")}</CardTitle>
          <CardDescription>{t("resources.general.site_info_desc")}</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-destructive" 
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">{t("resources.general.name")}</Label>
            <Input 
              value={clinic.name} 
              onChange={e => onUpdateField("name", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t("resources.general.email")}</Label>
            <Input 
              value={clinic.email || ""} 
              onChange={e => onUpdateField("email", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t("resources.general.phone")}</Label>
            <Input 
              value={clinic.phone || ""} 
              onChange={e => onUpdateField("phone", e.target.value)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t("resources.general.address")}</Label>
            <Input 
              value={clinic.address || ""} 
              onChange={e => onUpdateField("address", e.target.value)} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
