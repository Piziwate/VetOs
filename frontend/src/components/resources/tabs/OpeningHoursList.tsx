import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import type { Clinic } from "@/types/resource"
import { getDaysFr } from "../constants"

interface OpeningHoursListProps {
  clinic: Clinic
  onEditHours: (day: string) => void
}

export const OpeningHoursList = ({ clinic, onEditHours }: OpeningHoursListProps) => {
  const { t } = useTranslation()
  const daysFr = getDaysFr(t)

  return (
    <Card className="border-none shadow-none bg-accent/5">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> {t("resources.planning.opening_hours")}
        </CardTitle>
        <CardDescription className="text-sm">
          {t("resources.planning.opening_hours_desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(Object.keys(daysFr) as Array<keyof typeof daysFr>).map(day => {
            const slots = clinic.opening_hours?.[day] || []
            return (
              <div key={day} className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-background/50 group">
                <p className="text-xs font-bold uppercase text-muted-foreground/70">{daysFr[day]}</p>
                <div className="space-y-1.5 min-h-[40px] flex flex-col justify-center">
                  {slots.map((s, idx) => (
                    <p key={idx} className="text-xs font-semibold text-center text-primary bg-primary/5 py-1 rounded">
                      {s.open} — {s.close}
                    </p>
                  ))}
                  {slots.length === 0 && (
                    <p className="text-xs text-muted-foreground/30 text-center uppercase font-bold py-1">
                      {t("resources.planning.closed")}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => onEditHours(day)}
                  className="text-xs font-bold text-primary/60 hover:text-primary opacity-0 group-hover:opacity-100 transition-all pt-2 border-t border-border/20 mt-1"
                >
                  {t("resources.planning.edit")}
                </button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
