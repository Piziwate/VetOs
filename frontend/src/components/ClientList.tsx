import { useEffect, useState } from "react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AddClientDialog from "./AddClientDialog"

interface Client {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  city: string
}

export default function ClientList() {
  const { t } = useTranslation()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8000/api/v1/clients/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setClients(response.data)
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  if (loading) return <div>{t('client_form.saving')}</div>

  return (
    <Card className="w-full shadow-sm border-none bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('dashboard.clients_title')}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.clients_caption')}
          </p>
        </div>
        <AddClientDialog onClientAdded={fetchClients} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>{t('dashboard.clients_caption')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('client_form.last_name')}</TableHead>
              <TableHead>{t('client_form.email')}</TableHead>
              <TableHead>{t('client_form.phone')}</TableHead>
              <TableHead>{t('client_form.city')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.first_name} {client.last_name}
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.city}</TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {t('dashboard.no_clients')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
