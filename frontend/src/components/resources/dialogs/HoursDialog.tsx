import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { OpeningHoursSlot } from "@/types/resource"
import { getDaysFr } from "../constants"

interface HoursDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  day: string | null
  slots: OpeningHoursSlot[]
  onSlotsChange: (slots: OpeningHoursSlot[]) => void
  onSave: () => void
}

export const HoursDialog = ({ open, onOpenChange, day, slots, onSlotsChange, onSave }: HoursDialogProps) => {
  const { t } = useTranslation()
  const daysFr = getDaysFr(t)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{t("resources.dialogs.hours.title")} : {day ? daysFr[day as keyof typeof daysFr] : ""}</DialogTitle>
          <DialogDescription>{t("resources.dialogs.hours.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-left">
          {slots.map((slot, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border">
              <div className="flex-1 grid gap-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">{t("resources.dialogs.hours.open")}</Label>
                <Input type="time" value={slot.open} onChange={e => {
                  const next = [...slots]; next[idx].open = e.target.value; onSlotsChange(next);
                }} className="font-bold bg-background" />
              </div>
              <div className="flex-1 grid gap-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">{t("resources.dialogs.hours.close")}</Label>
                <Input type="time" value={slot.close} onChange={e => {
                  const next = [...slots]; next[idx].close = e.target.value; onSlotsChange(next);
                }} className="font-bold bg-background" />
              </div>
              <Button variant="ghost" size="icon" className="mt-5 hover:text-destructive" onClick={() => onSlotsChange(slots.filter((_, i) => i !== idx))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full border-dashed py-6 text-xs uppercase font-bold tracking-wider" onClick={() => onSlotsChange([...slots, { open: "08:00", close: "12:00" }])}>
            <Plus className="h-4 w-4 mr-2" /> {t("resources.dialogs.hours.add_slot")}
          </Button>
          {slots.length === 0 && <p className="text-center text-xs text-muted-foreground italic py-4">{t("resources.dialogs.hours.no_slots")}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t("resources.dialogs.hours.cancel")}</Button>
          <Button onClick={onSave} className="font-bold">{t("resources.dialogs.hours.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
