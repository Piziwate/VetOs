import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface ClosureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: { description: string, start_date: Date | undefined, end_date: Date | undefined }
  onChange: (data: { description: string, start_date: Date | undefined, end_date: Date | undefined }) => void
  onSubmit: () => void
}

export const ClosureDialog = ({ open, onOpenChange, data, onChange, onSubmit }: ClosureDialogProps) => {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-orange-600">{t("resources.dialogs.closure.title")}</DialogTitle>
          <DialogDescription>{t("resources.dialogs.closure.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-left">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("resources.dialogs.closure.reason")}</Label>
            <Input value={data.description} onChange={e => onChange({...data, description: e.target.value})} placeholder="ex: Vacances d'hiver" className="font-medium" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("resources.dialogs.closure.start_date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-9",
                      !data.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.start_date ? format(data.start_date, "dd.MM.yyyy") : <span>{t("resources.dialogs.closure.choose")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.start_date}
                    onSelect={(date: Date | undefined) => onChange({...data, start_date: date})}
                    locale={fr}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">{t("resources.dialogs.closure.end_date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-9",
                      !data.end_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.end_date ? format(data.end_date, "dd.MM.yyyy") : <span>{t("resources.dialogs.closure.choose")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.end_date}
                    onSelect={(date: Date | undefined) => onChange({...data, end_date: date})}
                    locale={fr}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t("resources.dialogs.closure.cancel")}</Button>
          <Button onClick={onSubmit} className="font-bold">{t("resources.dialogs.closure.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
