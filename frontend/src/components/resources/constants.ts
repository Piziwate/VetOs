import { 
  Stethoscope, Scissors, Activity, Search, Bed
} from "lucide-react"
import type { RoomType } from "@/types/resource"
import type { TFunction } from "i18next"

export const getRoomTypeLabels = (t: TFunction): Record<RoomType, string> => ({
  consultation: t("resources.room_types.consultation"),
  surgery: t("resources.room_types.surgery"),
  pre_op: t("resources.room_types.pre_op"),
  imaging: t("resources.room_types.imaging"),
  hospitalization: t("resources.room_types.hospitalization")
})

export const ROOM_TYPE_ICONS: Record<RoomType, React.ElementType> = {
  consultation: Stethoscope,
  surgery: Scissors,
  pre_op: Activity,
  imaging: Search,
  hospitalization: Bed
}

export const getDaysFr = (t: TFunction) => ({
  monday: t("resources.days.monday"),
  tuesday: t("resources.days.tuesday"),
  wednesday: t("resources.days.wednesday"),
  thursday: t("resources.days.thursday"),
  friday: t("resources.days.friday"),
  saturday: t("resources.days.saturday"),
  sunday: t("resources.days.sunday")
})
