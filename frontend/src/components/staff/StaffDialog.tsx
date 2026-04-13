import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type StaffFormData = {
  first_name: string
  last_name: string
  role: string
  specialty?: string
  phone?: string
  legacy_id?: string
}

interface StaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: StaffFormData
  onChange: (data: StaffFormData) => void
  onSubmit: () => void
  isEditing?: boolean
}

export const StaffDialog = ({ 
  open, 
  onOpenChange, 
  data, 
  onChange, 
  onSubmit,
  isEditing = false
}: StaffDialogProps) => {
  const { t } = useTranslation()

  const roles = ["vet", "assistant", "receptionist", "admin", "external", "student"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("staff.dialogs.edit_title") : t("staff.dialogs.create_title")}
          </DialogTitle>
          <DialogDescription>
            {t("staff.dialogs.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t("staff.dialogs.first_name")}</Label>
              <Input 
                id="first_name" 
                value={data.first_name} 
                onChange={e => onChange({ ...data, first_name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{t("staff.dialogs.last_name")}</Label>
              <Input 
                id="last_name" 
                value={data.last_name} 
                onChange={e => onChange({ ...data, last_name: e.target.value })} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t("staff.dialogs.role")}</Label>
            <Select 
              value={data.role} 
              onValueChange={v => onChange({ ...data, role: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {t(`staff.roles.${role}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">{t("staff.dialogs.specialty")}</Label>
            <Input 
              id="specialty" 
              value={data.specialty || ""} 
              onChange={e => onChange({ ...data, specialty: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("staff.dialogs.phone")}</Label>
            <Input 
              id="phone" 
              value={data.phone || ""} 
              onChange={e => onChange({ ...data, phone: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legacy_id">{t("staff.dialogs.legacy_id")}</Label>
            <Input 
              id="legacy_id" 
              value={data.legacy_id || ""} 
              onChange={e => onChange({ ...data, legacy_id: e.target.value })} 
              placeholder="ex: VETO_01"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("staff.dialogs.cancel")}
          </Button>
          <Button onClick={onSubmit}>
            {t("staff.dialogs.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
