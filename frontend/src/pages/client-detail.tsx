import * as React from "react"
import { useParams, Link } from "react-router-dom"
import { ChevronLeft, Mail, Phone, MapPin, PawPrint, User } from "lucide-react"
import api from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Patient {
  id: number
  name: string
  species: string
  breed: string
  gender: string
  date_of_birth: string
  is_active: boolean
  legacy_id: string
}

interface Client {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  zip_code: string
  is_active: boolean
  legacy_id: string
  patients: Patient[]
}

export function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const [client, setClient] = React.useState<Client | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients/${id}`)
        setClient(response.data)
      } catch (error) {
        console.error("Failed to fetch client details", error)
      } finally {
        setLoading(false)
      }
    }
    fetchClient()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <h2 className="text-xl font-semibold">Client non trouvé</h2>
        <Button asChild variant="link">
          <Link to="/clients">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/clients">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {client.last_name} {client.first_name}
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-mono text-xs">ID Diana: {client.legacy_id}</span>
            <Badge variant={client.is_active ? "default" : "secondary"}>
              {client.is_active ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-4 w-4" />
              Informations de contact
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="grid gap-0.5">
                <p className="text-sm font-medium leading-none text-muted-foreground">Email</p>
                <p className="text-sm">{client.email || "Non renseigné"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="grid gap-0.5">
                <p className="text-sm font-medium leading-none text-muted-foreground">Téléphone</p>
                <p className="text-sm">{client.phone || "Non renseigné"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="grid gap-0.5">
                <p className="text-sm font-medium leading-none text-muted-foreground">Adresse</p>
                <p className="text-sm leading-snug">
                  {client.address}<br />
                  {client.zip_code} {client.city}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="grid gap-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PawPrint className="h-4 w-4" />
                Animaux
              </CardTitle>
              <CardDescription>
                Liste des patients rattachés à ce client.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">Ajouter un animal</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Espèce</TableHead>
                  <TableHead>Race</TableHead>
                  <TableHead>Sexe</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Aucun animal enregistré.
                    </TableCell>
                  </TableRow>
                ) : (
                  client.patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.species}</TableCell>
                      <TableCell>{patient.breed}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/patients/${patient.id}`}>Voir</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
