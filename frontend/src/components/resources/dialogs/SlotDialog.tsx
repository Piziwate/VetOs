import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SlotType } from "@/types/resource"

interface SlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: { box_reference: string, type: SlotType }
  onChange: (data: { box_reference: string, type: SlotType }) => void
  onSubmit: () => void
}

export const SlotDialog = ({ open, onOpenChange, data, onChange, onSubmit }: SlotDialogProps) => {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-primary">{t("resources.dialogs.unit.title")}</DialogTitle>
          <DialogDescription>{t("resources.dialogs.unit.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-left">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("resources.dialogs.unit.reference")}</Label>
            <Input value={data.box_reference} onChange={e => onChange({...data, box_reference: e.target.value})} placeholder="ex: Box A1" className="font-bold" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("resources.dialogs.unit.format")}</Label>
            <Select value={data.type} onValueChange={v => onChange({...data, type: v as SlotType})}>
              <SelectTrigger className="font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cage">Cage</SelectItem>
                <SelectItem value="box">Box</SelectItem>
                <SelectItem value="parc">Parc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t("resources.dialogs.unit.cancel")}</Button>
          <Button onClick={onSubmit}>{t("resources.dialogs.unit.add")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
