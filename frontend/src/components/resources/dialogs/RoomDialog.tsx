import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RoomType } from "@/types/resource"
import { getRoomTypeLabels } from "../constants"

interface RoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: { name: string, type: RoomType }
  onChange: (data: { name: string, type: RoomType }) => void
  onSubmit: () => void
}

export const RoomDialog = ({ open, onOpenChange, data, onChange, onSubmit }: RoomDialogProps) => {
  const { t } = useTranslation()
  const roomTypeLabels = getRoomTypeLabels(t)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{t("resources.dialogs.room.title")}</DialogTitle>
          <DialogDescription>{t("resources.dialogs.room.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-left">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("resources.dialogs.room.name")}</Label>
            <Input value={data.name} onChange={e => onChange({...data, name: e.target.value})} placeholder="ex: Consultation 1" className="font-medium" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("resources.dialogs.room.vocation")}</Label>
            <Select value={data.type} onValueChange={v => onChange({...data, type: v as RoomType})}>
              <SelectTrigger className="font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roomTypeLabels).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t("resources.dialogs.room.cancel")}</Button>
          <Button onClick={onSubmit}>{t("resources.dialogs.room.create")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
