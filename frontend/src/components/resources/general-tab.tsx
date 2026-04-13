import type { Clinic } from "@/types/resource"
import { ClinicInfoForm } from "./tabs/ClinicInfoForm"
import { StaffAccessList } from "./tabs/StaffAccessList"

interface GeneralTabProps {
  activeClinic: Clinic
  onUpdateField: (field: keyof Clinic, value: Clinic[keyof Clinic]) => void
  onDeleteClinic: () => void
  onManageStaff: () => void
}

export const GeneralTab = ({ 
  activeClinic, 
  onUpdateField, 
  onDeleteClinic,
  onManageStaff
}: GeneralTabProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <ClinicInfoForm 
        clinic={activeClinic}
        onUpdateField={onUpdateField}
        onDelete={onDeleteClinic}
      />
      
      <StaffAccessList 
        staff={activeClinic.staff}
        onManageAccess={onManageStaff}
      />
    </div>
  )
}
