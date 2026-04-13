import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Building2, DoorOpen, Bed, Trash2 } from "lucide-react"
import api from "@/lib/api"

interface Clinic {
  id: number
  name: string
  address: string
  phone: string
  email: string
  opening_hours: any
  rooms: any[]
}

export const Resources = () => {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [activeClinic, setActiveClinic] = useState<Clinic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClinics()
  }, [])

  const fetchClinics = async () => {
    try {
      const response = await api.get("/resources/clinics")
      setClinics(response.data)
      if (response.data.length > 0 && !activeClinic) {
        setActiveClinic(response.data[0])
      }
    } catch (error) {
      console.error("Failed to fetch clinics", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClinic = async () => {
    try {
      const newClinic = {
        name: "Nouveau Cabinet",
        address: "",
        phone: "",
        email: "",
        opening_hours: {
          monday: [{ open: "08:00", close: "18:00" }],
          tuesday: [{ open: "08:00", close: "18:00" }],
          wednesday: [{ open: "08:00", close: "18:00" }],
          thursday: [{ open: "08:00", close: "18:00" }],
          friday: [{ open: "08:00", close: "18:00" }],
          saturday: [],
          sunday: []
        }
      }
      const response = await api.post("/resources/clinics", newClinic)
      setClinics([...clinics, response.data])
      setActiveClinic(response.data)
    } catch (error) {
      console.error("Failed to create clinic", error)
    }
  }

  const handleUpdateClinicField = async (field: keyof Clinic, value: any) => {
    if (!activeClinic) return
    
    // Optimistic update
    const updatedClinic = { ...activeClinic, [field]: value }
    setActiveClinic(updatedClinic)
    setClinics(clinics.map(c => c.id === activeClinic.id ? updatedClinic : c))

    try {
      await api.put(`/resources/clinics/${activeClinic.id}`, { [field]: value })
    } catch (error) {
      console.error("Failed to update clinic", error)
      // Revert on error could be implemented here
    }
  }

  const handleAddRoom = async () => {
    if (!activeClinic) return
    const roomName = prompt("Nom de la nouvelle salle ?")
    if (!roomName) return
    
    try {
      const response = await api.post("/resources/rooms", {
        name: roomName,
        type: "consultation", // default type
        clinic_id: activeClinic.id
      })
      const updatedClinic = { ...activeClinic, rooms: [...activeClinic.rooms, response.data] }
      setActiveClinic(updatedClinic)
      setClinics(clinics.map(c => c.id === activeClinic.id ? updatedClinic : c))
    } catch (error) {
      console.error("Failed to create room", error)
    }
  }

  const handleDeleteRoom = async (roomId: number) => {
    if (!activeClinic || !window.confirm("Êtes-vous sûr de vouloir supprimer cette salle ?")) return
    try {
      await api.delete(`/resources/rooms/${roomId}`)
      const updatedClinic = { ...activeClinic, rooms: activeClinic.rooms.filter((r: any) => r.id !== roomId) }
      setActiveClinic(updatedClinic)
      setClinics(clinics.map(c => c.id === activeClinic.id ? updatedClinic : c))
    } catch (error) {
      console.error("Failed to delete room", error)
    }
  }

  const handleDeleteClinic = async () => {
    if (!activeClinic || !window.confirm("Êtes-vous sûr de vouloir supprimer cette clinique ?")) return
    try {
      await api.delete(`/resources/clinics/${activeClinic.id}`)
      const newClinics = clinics.filter(c => c.id !== activeClinic.id)
      setClinics(newClinics)
      setActiveClinic(newClinics.length > 0 ? newClinics[0] : null)
    } catch (error) {
      console.error("Failed to delete clinic", error)
    }
  }

  if (loading) return <div>Chargement des ressources...</div>

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Ressources</h1>
          <p className="text-muted-foreground">Configurez vos cliniques, salles techniques et capacités d'accueil.</p>
        </div>
        <Button onClick={handleCreateClinic}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une Clinique
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar: Liste des cliniques */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs uppercase font-bold text-muted-foreground px-2">Mes Cliniques</Label>
          {clinics.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveClinic(c)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeClinic?.id === c.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent text-muted-foreground"}`}
            >
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Main: Détails de la clinique active */}
        <div className="md:col-span-3 flex flex-col gap-8">
          {activeClinic ? (
            <>
              {/* Infos Générales */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-xl">Informations du Cabinet</CardTitle>
                    <CardDescription>Coordonnées et identité du site de {activeClinic.name}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDeleteClinic}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nom du site</Label>
                      <Input 
                        id="name" 
                        value={activeClinic.name || ""} 
                        onChange={(e) => handleUpdateClinicField("name", e.target.value)} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email spécifique</Label>
                      <Input 
                        id="email" 
                        value={activeClinic.email || ""} 
                        onChange={(e) => handleUpdateClinicField("email", e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Adresse physique</Label>
                    <Input 
                      id="address" 
                      value={activeClinic.address || ""} 
                      onChange={(e) => handleUpdateClinicField("address", e.target.value)} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      value={activeClinic.phone || ""} 
                      onChange={(e) => handleUpdateClinicField("phone", e.target.value)} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Salles & Équipements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-lg">Salles & Plateaux</CardTitle>
                      <CardDescription>Salles de soins et chirurgie</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddRoom}><Plus className="h-4 w-4" /></Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {activeClinic.rooms?.length === 0 && <p className="text-sm text-muted-foreground italic">Aucune salle configurée.</p>}
                      {activeClinic.rooms?.map((room: any) => (
                        <div key={room.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-3">
                            <DoorOpen className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium">{room.name}</p>
                              <Badge variant="secondary" className="text-[10px] uppercase">{room.type}</Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteRoom(room.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-lg">Hospitalisation</CardTitle>
                      <CardDescription>Capacités d'accueil et boxes</CardDescription>
                    </div>
                    <Button variant="outline" size="sm"><Bed className="h-4 w-4" /></Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {/* On filtrera les slots des salles de type hospitalization ici */}
                      <p className="text-sm text-muted-foreground italic">Sélectionnez une salle d'hospit pour voir les slots.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Horaires d'ouverture */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Horaires d'ouverture</CardTitle>
                  <CardDescription>Utilisés pour le moteur de rendez-vous</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
                      <div key={day} className="p-3 border rounded-lg bg-accent/20">
                        <p className="text-sm font-bold mb-2">{day}</p>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-green-600 font-medium">08:00 - 12:00</span>
                          <span className="text-xs text-green-600 font-medium">14:00 - 18:00</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
              Sélectionnez ou créez une clinique pour commencer la configuration.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
