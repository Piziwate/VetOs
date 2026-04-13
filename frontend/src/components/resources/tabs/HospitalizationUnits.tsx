import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DoorOpen, Plus, Bed, X } from "lucide-react"
import type { Room } from "@/types/resource"
import { getRoomTypeLabels } from "../constants"

interface HospitalizationUnitsProps {
  activeRoom: Room | undefined
  onAddSlot: () => void
  onDeleteSlot: (roomId: number, slotId: number) => void
}

export const HospitalizationUnits = ({
  activeRoom,
  onAddSlot,
  onDeleteSlot
}: HospitalizationUnitsProps) => {
  const { t } = useTranslation()
  const roomTypeLabels = getRoomTypeLabels(t)

  return (
    <Card className="flex flex-col border-none shadow-none bg-accent/5">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Bed className="h-4 w-4 text-primary" /> {t("resources.infrastructure.hospitalization")}
        </CardTitle>
        {activeRoom?.type === "hospitalization" && (
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={onAddSlot}>
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4 flex-1 px-4">
        {!activeRoom ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
            <DoorOpen className="h-8 w-8 text-muted-foreground/20" />
            <p className="text-xs text-muted-foreground">{t("resources.infrastructure.no_room_selected")}</p>
          </div>
        ) : activeRoom.type !== "hospitalization" ? (
          <div className="text-center py-12 space-y-3">
            <Badge variant="outline" className="text-[10px] font-semibold uppercase px-3 py-0.5">
              {roomTypeLabels[activeRoom.type]}
            </Badge>
            <p className="text-xs text-muted-foreground max-w-[180px] mx-auto">
              {t("resources.infrastructure.not_hospitalization")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {activeRoom.slots?.map(slot => (
              <div 
                key={slot.id} 
                className="flex items-center justify-between px-3 py-2 bg-background/50 rounded-lg border border-transparent hover:border-primary/30 transition-all group shadow-sm"
              >
                <span className="font-semibold text-xs truncate">{slot.box_reference}</span>
                <button 
                  onClick={() => onDeleteSlot(activeRoom.id, slot.id)} 
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {activeRoom.slots?.length === 0 && (
              <p className="col-span-2 text-xs text-muted-foreground italic text-center py-8">
                {t("resources.infrastructure.no_units")}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
