import * as React from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { 
  User, 
  Dog, 
  Calendar, 
  CreditCard
} from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import api from "@/lib/api"

// Sub-components
import { ClientHeader } from "@/components/client/client-header"
import { ClientDetailsTab } from "@/components/client/client-details-tab"
import { ClientPatientsTab } from "@/components/client/client-patients-tab"

interface Client {
  id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  is_active: boolean
  legacy_id: string
}

interface Patient {
  id: number
  name: string
  species: string
  breed: string | null
  birth_date: string | null
  is_active: boolean
}

export function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const [client, setClient] = React.useState<Client | null>(null)
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, patientsRes] = await Promise.all([
          api.get(`/clients/${id}`),
          api.get(`/clients/${id}/patients`)
        ])
        setClient(clientRes.data)
        setPatients(patientsRes.data)
      } catch (error) {
        console.error("Failed to fetch client details", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">{t("clients.loading")}</div>
  }

  if (!client) {
    return <div className="text-center py-12">{t("clients.no_results")}</div>
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <ClientHeader 
        name={`${client.first_name} ${client.last_name}`}
        isActive={client.is_active}
        legacyId={client.legacy_id}
      />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
          <TabsTrigger 
            value="details" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
          >
            <User className="h-4 w-4 mr-2" />
            {t("client_detail.tabs.details")}
          </TabsTrigger>
          <TabsTrigger 
            value="patients"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
          >
            <Dog className="h-4 w-4 mr-2" />
            {t("client_detail.tabs.patients")}
          </TabsTrigger>
          <TabsTrigger 
            value="appointments"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {t("client_detail.tabs.appointments")}
          </TabsTrigger>
          <TabsTrigger 
            value="billing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {t("client_detail.tabs.billing")}
          </TabsTrigger>
        </TabsList>

        <div className="pt-6">
          <TabsContent value="details" className="mt-0">
            <ClientDetailsTab 
              email={client.email}
              phone={client.phone}
              address={client.address}
              city={client.city}
            />
          </TabsContent>

          <TabsContent value="patients" className="mt-0">
            <ClientPatientsTab 
              patients={patients}
              onAddPatient={() => console.log("Add patient")}
            />
          </TabsContent>

          <TabsContent value="appointments" className="mt-0">
            <div className="py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
              {t("client_detail.tabs.appointments")} (Work in progress)
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-0">
            <div className="py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
              {t("client_detail.tabs.billing")} (Work in progress)
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
