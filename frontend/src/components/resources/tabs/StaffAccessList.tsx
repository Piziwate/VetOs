import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus } from "lucide-react"
import type { StaffMember } from "@/types/resource"

interface StaffAccessListProps {
  staff: StaffMember[]
  onManageAccess: () => void
}

export const StaffAccessList = ({ staff, onManageAccess }: StaffAccessListProps) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> {t("resources.general.team")}
          </CardTitle>
          <CardDescription>{t("resources.general.team_desc")}</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onManageAccess}>
          <UserPlus className="h-3.5 w-3.5 mr-2" /> {t("resources.general.manage_access")}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff?.map(member => (
            <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg bg-accent/5">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold border border-primary/20">
                {member.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium">{member.full_name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">{member.role}</p>
              </div>
            </div>
          ))}
          {staff?.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground italic text-center py-8">
              {t("resources.general.no_staff")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
