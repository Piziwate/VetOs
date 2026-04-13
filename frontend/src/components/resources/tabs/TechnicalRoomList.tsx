import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DoorOpen, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Room, RoomType } from "@/types/resource"
import { ROOM_TYPE_ICONS, getRoomTypeLabels } from "../constants"

interface TechnicalRoomListProps {
  rooms: Room[]
  activeRoomId: number | null
  onSetActiveRoomId: (id: number) => void
  onAddRoom: () => void
  onUpdateRoomType: (roomId: number, type: RoomType) => void
  onDeleteRoom: (roomId: number) => void
}

export const TechnicalRoomList = ({
  rooms,
  activeRoomId,
  onSetActiveRoomId,
  onAddRoom,
  onUpdateRoomType,
  onDeleteRoom
}: TechnicalRoomListProps) => {
  const { t } = useTranslation()
  const roomTypeLabels = getRoomTypeLabels(t)

  return (
    <Card className="flex flex-col border-none shadow-none bg-accent/5">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <DoorOpen className="h-4 w-4 text-primary" /> {t("resources.infrastructure.technical_rooms")}
        </CardTitle>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={onAddRoom}>
          <Plus className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4 flex-1 px-4">
        <div className="space-y-2">
          {rooms?.map(room => {
            const Icon = ROOM_TYPE_ICONS[room.type] || DoorOpen
            return (
              <div 
                key={room.id}
                onClick={() => onSetActiveRoomId(room.id)}
                className={`flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all ${
                  activeRoomId === room.id 
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm" 
                    : "hover:bg-accent/50 border-transparent bg-background/50"
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`p-1.5 rounded-md ${
                    activeRoomId === room.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{room.name}</p>
                    <Select 
                      value={room.type} 
                      onValueChange={(val: RoomType) => onUpdateRoomType(room.id, val)}
                    >
                      <SelectTrigger className="h-auto p-0 border-none bg-transparent shadow-none focus:ring-0 text-[10px] text-muted-foreground uppercase font-semibold hover:text-primary transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roomTypeLabels).map(([val, label]) => (
                          <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors" 
                  onClick={(e) => { e.stopPropagation(); onDeleteRoom(room.id); }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )
          })}
          {rooms?.length === 0 && (
            <p className="text-xs text-muted-foreground italic text-center py-8">
              {t("resources.infrastructure.no_rooms")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
