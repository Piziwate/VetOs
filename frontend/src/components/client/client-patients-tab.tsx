import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, PawPrint } from "lucide-react"

interface Patient {
  id: number
  name: string
  species: string
  breed: string | null
  birth_date: string | null
  is_active: boolean
}

interface ClientPatientsTabProps {
  patients: Patient[]
  onAddPatient?: () => void
}

export const ClientPatientsTab = ({ patients, onAddPatient }: ClientPatientsTabProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={onAddPatient}>
          <Plus className="h-4 w-4" />
          {t("client_detail.add_patient")}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <Card key={patient.id} className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                  <PawPrint className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-primary transition-colors">{patient.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {patient.species} {patient.breed ? `• ${patient.breed}` : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {patients.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
            {t("client_detail.no_patients")}
          </div>
        )}
      </div>
    </div>
  )
}
