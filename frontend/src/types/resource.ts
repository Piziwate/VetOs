export type RoomType = "consultation" | "surgery" | "pre_op" | "imaging" | "hospitalization"
export type SlotType = "cage" | "box" | "parc"

export interface HospitalizationSlot {
  id: number
  box_reference: string
  type: SlotType
  room_id: number
  attributes?: Record<string, unknown>
}

export interface Room {
  id: number
  name: string
  type: RoomType
  clinic_id: number
  slots: HospitalizationSlot[]
  attributes?: Record<string, unknown>
}

export interface ClinicClosure {
  id: number
  start_date: string
  end_date: string
  description: string
}

export interface OpeningHoursSlot {
  open: string
  close: string
}

export interface StaffMember {
  id: number
  full_name: string
  email: string
  role: string
}

export interface Clinic {
  id: number
  name: string
  address: string
  phone: string
  email: string
  opening_hours: Record<string, OpeningHoursSlot[]>
  rooms: Room[]
  closures: ClinicClosure[]
  staff: StaffMember[]
}

export interface Setting {
  key: string
  value: string | number | boolean | Record<string, unknown> | Array<unknown>
  category: string
  sub_category: string
  description: string
}
