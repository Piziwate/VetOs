import type { Clinic } from "@/types/resource"
import { OpeningHoursList } from "./tabs/OpeningHoursList"
import { ClosuresList } from "./tabs/ClosuresList"

interface PlanningTabProps {
  activeClinic: Clinic
  onEditHours: (day: string) => void
  onAddClosure: () => void
  onDeleteClosure: (id: number) => void
}

export const PlanningTab = ({
  activeClinic,
  onEditHours,
  onAddClosure,
  onDeleteClosure
}: PlanningTabProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <OpeningHoursList 
        clinic={activeClinic}
        onEditHours={onEditHours}
      />

      <ClosuresList 
        clinic={activeClinic}
        onAddClosure={onAddClosure}
        onDeleteClosure={onDeleteClosure}
      />
    </div>
  )
}
