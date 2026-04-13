import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Plus } from "lucide-react"
import type { StaffMember } from "@/types/resource"

interface StaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  allUsers: StaffMember[]
  assignedStaff: StaffMember[]
  onToggleStaff: (userId: number) => void
}

export const StaffDialog = ({ open, onOpenChange, allUsers, assignedStaff, onToggleStaff }: StaffDialogProps) => {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("resources.dialogs.staff.title")}</DialogTitle>
          <DialogDescription>{t("resources.dialogs.staff.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto pr-2">
          {allUsers.map(user => {
            const isAssigned = assignedStaff?.some(u => u.id === user.id)
            return (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-accent/30 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isAssigned ? "bg-primary/10 border-primary text-primary" : "bg-muted border-transparent text-muted-foreground"}`}>
                    {user.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.full_name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{user.role}</p>
                  </div>
                </div>
                <Button 
                  variant={isAssigned ? "default" : "outline"} 
                  size="sm" 
                  className={`h-8 w-8 p-0 rounded-full transition-all ${isAssigned ? "bg-primary" : ""}`}
                  onClick={() => onToggleStaff(user.id)}
                >
                  {isAssigned ? <Check className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            )
          })}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">{t("resources.dialogs.staff.finish")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
