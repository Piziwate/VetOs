import type { Clinic, RoomType } from "@/types/resource"
import { TechnicalRoomList } from "./tabs/TechnicalRoomList"
import { HospitalizationUnits } from "./tabs/HospitalizationUnits"

interface InfrastructureTabProps {
  activeClinic: Clinic
  activeRoomId: number | null
  onSetActiveRoomId: (id: number) => void
  onAddRoom: () => void
  onUpdateRoomType: (roomId: number, type: RoomType) => void
  onDeleteRoom: (roomId: number) => void
  onAddSlot: () => void
  onDeleteSlot: (roomId: number, slotId: number) => void
}

export const InfrastructureTab = ({
  activeClinic,
  activeRoomId,
  onSetActiveRoomId,
  onAddRoom,
  onUpdateRoomType,
  onDeleteRoom,
  onAddSlot,
  onDeleteSlot
}: InfrastructureTabProps) => {
  const activeRoom = activeClinic.rooms.find(r => r.id === activeRoomId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
      <TechnicalRoomList 
        rooms={activeClinic.rooms}
        activeRoomId={activeRoomId}
        onSetActiveRoomId={onSetActiveRoomId}
        onAddRoom={onAddRoom}
        onUpdateRoomType={onUpdateRoomType}
        onDeleteRoom={onDeleteRoom}
      />

      <HospitalizationUnits 
        activeRoom={activeRoom}
        onAddSlot={onAddSlot}
        onDeleteSlot={onDeleteSlot}
      />
    </div>
  )
}
