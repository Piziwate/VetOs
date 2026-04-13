import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import type { Clinic } from "@/types/resource"

interface ClosuresListProps {
  clinic: Clinic
  onAddClosure: () => void
  onDeleteClosure: (id: number) => void
}

export const ClosuresList = ({ clinic, onAddClosure, onDeleteClosure }: ClosuresListProps) => {
  const { t } = useTranslation()

  return (
    <Card className="border-none shadow-none bg-accent/5">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" /> {t("resources.planning.closures")}
          </CardTitle>
          <CardDescription className="text-sm">
            {t("resources.planning.closures_desc")}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="text-xs h-8" onClick={onAddClosure}>
          <Plus className="h-3.5 w-3.5 mr-2" /> {t("resources.planning.program")}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {clinic.closures?.map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-background/50 border border-border rounded-xl transition-all hover:shadow-sm group">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-sm font-semibold">{c.description}</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                  {format(new Date(c.start_date), "dd.MM.yyyy")} — {format(new Date(c.end_date), "dd.MM.yyyy")}
                </span>
              </div>
              <button 
                onClick={() => onDeleteClosure(c.id)} 
                className="p-1.5 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {clinic.closures?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-xl space-y-2 opacity-50">
              <CalendarIcon className="h-8 w-8 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">{t("resources.planning.no_closures")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
