import * as React from "react"
import { useParams, Link } from "react-router-dom"
import { ChevronLeft, Mail, Phone, MapPin, PawPrint, User, Building2, Plus } from "lucide-react"
import api from "@/lib/api"
import { useSettings } from "@/hooks/use-settings"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  favorite_clinic_id: number | null
  patients: Patient[]
}

export function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const { clinics } = useSettings()
  const [client, setClient] = React.useState<Client | null>(null)
  const [loading, setLoading] = React.useState(true)

  const fetchClient = React.useCallback(async () => {
    try {
      const response = await api.get(`/clients/${id}`)
      setClient(response.data)
    } catch (error) {
      console.error("Failed to fetch client details", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchClient()
  }, [fetchClient])

  const handleUpdateFavoriteClinic = async (clinicId: string) => {
    if (!client) return
    const cid = clinicId === "none" ? null : parseInt(clinicId)
    try {
      await api.put(`/clients/${id}`, { favorite_clinic_id: cid })
      setClient({ ...client, favorite_clinic_id: cid })
    } catch (error) {
      console.error("Failed to update favorite clinic", error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
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
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="p-4 bg-accent/50 rounded-full">
          <User className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Client non trouvé</h2>
          <p className="text-sm text-muted-foreground">Le client demandé n'existe pas ou a été supprimé.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/clients">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="h-8 w-8">
          <Link to="/clients">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {client.last_name} {client.first_name}
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-mono text-xs text-primary/70">ID Diana: {client.legacy_id}</span>
            <Badge variant={client.is_active ? "default" : "secondary"} className="text-[10px] uppercase font-bold px-2 py-0 h-4">
              {client.is_active ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b bg-accent/5">
              <CardTitle className="flex items-center gap-2 text-md font-semibold text-primary">
                <User className="h-4 w-4" />
                Coordonnées
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 pt-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="grid gap-0.5">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{client.email || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="grid gap-0.5">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Téléphone</p>
                  <p className="text-sm font-medium">{client.phone || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="grid gap-0.5">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Adresse</p>
                  <p className="text-sm font-medium leading-snug">
                    {client.address}<br />
                    {client.zip_code} {client.city}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location / Multi-site Card */}
          <Card className="border-primary/20 shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-md font-semibold text-primary">
                <Building2 className="h-4 w-4" />
                Préférences de site
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-left">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Clinique habituelle</Label>
                <Select 
                  value={client.favorite_clinic_id?.toString() || "none"} 
                  onValueChange={handleUpdateFavoriteClinic}
                >
                  <SelectTrigger className="w-full font-medium">
                    <SelectValue placeholder="Sélectionner une clinique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune (Passager)</SelectItem>
                    {clinics.map(clinic => (
                      <SelectItem key={clinic.id} value={clinic.id.toString()}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground italic">
                  Utilisé pour filtrer le planning et les rappels par défaut.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div className="grid gap-1">
              <CardTitle className="flex items-center gap-2 text-md font-semibold text-primary">
                <PawPrint className="h-4 w-4" />
                Patients
              </CardTitle>
              <CardDescription className="text-xs">
                Animaux rattachés à ce foyer.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs font-bold uppercase tracking-tight">
              <Plus className="h-3 w-3 mr-1" /> Ajouter
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase">Nom</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">Espèce</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">Race</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">Sexe</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic text-xs">
                      Aucun animal enregistré.
                    </TableCell>
                  </TableRow>
                ) : (
                  client.patients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-accent/30 transition-colors">
                      <TableCell className="font-bold text-sm text-primary">{patient.name}</TableCell>
                      <TableCell className="text-xs font-medium uppercase">{patient.species}</TableCell>
                      <TableCell className="text-xs">{patient.breed}</TableCell>
                      <TableCell className="text-xs italic">{patient.gender}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
                          <Link to={`/patients/${patient.id}`}>Dossier</Link>
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
