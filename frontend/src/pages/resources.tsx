import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, Building2, DoorOpen, Bed, Trash2, 
  Stethoscope, Scissors, Activity, Search,
  Clock, Calendar, AlertTriangle
} from "lucide-react"
import api from "@/lib/api"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type RoomType = "consultation" | "surgery" | "pre_op" | "imaging" | "hospitalization"
type SlotType = "cage" | "box" | "parc"

interface HospitalizationSlot {
  id: number
  box_reference: string
  type: SlotType
  room_id: number
}

interface Room {
  id: number
  name: string
  type: RoomType
  clinic_id: number
  slots: HospitalizationSlot[]
}

interface Clinic {
  id: number
  name: string
  address: string
  phone: string
  email: string
  opening_hours: any
  rooms: Room[]
  closures: any[]
}

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  consultation: "Consultation",
  surgery: "Chirurgie",
  pre_op: "Pré-opératoire",
  imaging: "Imagerie",
  hospitalization: "Hospitalisation"
}

const ROOM_TYPE_ICONS: Record<RoomType, any> = {
  consultation: Stethoscope,
  surgery: Scissors,
  pre_op: Activity,
  imaging: Search,
  hospitalization: Bed
}

export const Resources = () => {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [activeClinic, setActiveClinic] = useState<Clinic | null>(null)
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Dialog States
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [newRoomData, setNewRoomData] = useState({ name: "", type: "consultation" as RoomType })
  
  const [isSlotDialogOpen, setIsRoomSlotDialogOpen] = useState(false)
  const [newSlotData, setNewSlotData] = useState({ box_reference: "", type: "cage" as SlotType })

  const [isClosureDialogOpen, setIsClosureDialogOpen] = useState(false)
  const [newClosureData, setNewClosureData] = useState({ description: "", start_date: "", end_date: "" })

  const [alertConfig, setAlertConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({ open: false, title: "", description: "", action: () => {} })

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
    const updatedClinic = { ...activeClinic, [field]: value }
    setActiveClinic(updatedClinic)
    setClinics(clinics.map(c => c.id === activeClinic.id ? updatedClinic : c))
    try {
      await api.put(`/resources/clinics/${activeClinic.id}`, { [field]: value })
    } catch (error) {
      console.error("Failed to update clinic", error)
    }
  }

  const handleAddRoomSubmit = async () => {
    if (!activeClinic || !newRoomData.name) return
    try {
      const response = await api.post("/resources/rooms", {
        name: newRoomData.name,
        type: newRoomData.type,
        clinic_id: activeClinic.id
      })
      const updatedClinic = { ...activeClinic, rooms: [...activeClinic.rooms, response.data] }
      setActiveClinic(updatedClinic)
      setClinics(clinics.map(c => c.id === activeClinic.id ? updatedClinic : c))
      setIsRoomDialogOpen(false)
      setNewRoomData({ name: "", type: "consultation" })
    } catch (error) {
      console.error("Failed to create room", error)
    }
  }

  const handleUpdateRoomType = async (roomId: number, type: RoomType) => {
    if (!activeClinic) return
    try {
      await api.put(`/resources/rooms/${roomId}`, { type })
      const updatedRooms = activeClinic.rooms.map(r => r.id === roomId ? { ...r, type } : r)
      const updatedClinic = { ...activeClinic, rooms: updatedRooms }
      setActiveClinic(updatedClinic)
      setClinics(clinics.map(c => c.id === activeClinic.id ? updatedClinic : c))
    } catch (error) {
      console.error("Failed to update room type", error)
    }
  }

  const handleDeleteRoom = (roomId: number) => {
    setAlertConfig({
      open: true,
      title: "Supprimer la salle ?",
      description: "Cette action supprimera également tous les emplacements d'hospitalisation liés. Cette action est irréversible.",
      action: async () => {
        try {
          await api.delete(`/resources/rooms/${roomId}`)
          const updatedClinic = { ...activeClinic!, rooms: activeClinic!.rooms.filter(r => r.id !== roomId) }
          setActiveClinic(updatedClinic)
          setClinics(clinics.map(c => c.id === activeClinic!.id ? updatedClinic : c))
          if (activeRoomId === roomId) setActiveRoomId(null)
        } catch (error) {
          console.error("Failed to delete room", error)
        }
      }
    })
  }

  const handleAddSlotSubmit = async () => {
    if (!activeRoomId || !newSlotData.box_reference) return
    try {
      const response = await api.post("/resources/slots", {
        box_reference: newSlotData.box_reference,
        type: newSlotData.type,
        room_id: activeRoomId
      })
      const updatedRooms = activeClinic!.rooms.map(r => 
        r.id === activeRoomId ? { ...r, slots: [...(r.slots || []), response.data] } : r
      )
      const updatedClinic = { ...activeClinic!, rooms: updatedRooms }
      setActiveClinic(updatedClinic)
      setClinics(clinics.map(c => c.id === activeClinic!.id ? updatedClinic : c))
      setIsRoomSlotDialogOpen(false)
      setNewSlotData({ box_reference: "", type: "cage" })
    } catch (error) {
      console.error("Failed to add slot", error)
    }
  }

  const handleDeleteSlot = (roomId: number, slotId: number) => {
    setAlertConfig({
      open: true,
      title: "Supprimer l'emplacement ?",
      description: "L'emplacement d'hospitalisation sera définitivement retiré.",
      action: async () => {
        try {
          await api.delete(`/resources/slots/${slotId}`)
          const updatedRooms = activeClinic!.rooms.map(r => 
            r.id === roomId ? { ...r, slots: r.slots.filter(s => s.id !== slotId) } : r
          )
          const updatedClinic = { ...activeClinic!, rooms: updatedRooms }
          setActiveClinic(updatedClinic)
          setClinics(clinics.map(c => c.id === activeClinic!.id ? updatedClinic : c))
        } catch (error) {
          console.error("Failed to delete slot", error)
        }
      }
    })
  }

  const handleAddClosureSubmit = async () => {
    if (!activeClinic || !newClosureData.description || !newClosureData.start_date || !newClosureData.end_date) return
    try {
      const response = await api.post("/resources/closures", {
        clinic_id: activeClinic.id,
        ...newClosureData
      })
      const updatedClinic = { ...activeClinic, closures: [...(activeClinic.closures || []), response.data] }
      setActiveClinic(updatedClinic)
      setClinics(clinics.map(c => c.id === activeClinic.id ? updatedClinic : c))
      setIsClosureDialogOpen(false)
      setNewClosureData({ description: "", start_date: "", end_date: "" })
    } catch (error) {
      console.error("Failed to add closure", error)
      alert("Format de date invalide (YYYY-MM-DD) ou erreur serveur.")
    }
  }

  const handleDeleteClosure = (closureId: number) => {
    setAlertConfig({
      open: true,
      title: "Supprimer la fermeture ?",
      description: "Cette période redeviendra disponible pour les rendez-vous.",
      action: async () => {
        try {
          await api.delete(`/resources/closures/${closureId}`)
          const updatedClinic = { ...activeClinic!, closures: activeClinic!.closures.filter(c => c.id !== closureId) }
          setActiveClinic(updatedClinic)
          setClinics(clinics.map(c => c.id === activeClinic!.id ? updatedClinic : c))
        } catch (error) {
          console.error("Failed to delete closure", error)
        }
      }
    })
  }

  const activeRoom = activeClinic?.rooms.find(r => r.id === activeRoomId)

  if (loading) return <div className="p-8 text-center font-medium text-muted-foreground animate-pulse">Chargement des ressources...</div>

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Ressources & Sites</h1>
          <p className="text-muted-foreground">Pilotez vos cliniques et leurs équipements.</p>
        </div>
        <Button onClick={handleCreateClinic} className="shadow-lg hover:scale-105 transition-transform text-xs uppercase font-black tracking-widest">
          <Plus className="mr-2 h-4 w-4" /> Nouveau Site
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Liste des sites */}
        <div className="flex flex-col gap-2 bg-accent/10 p-4 rounded-xl border border-accent/20">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2 mb-2">Sites Physiques</Label>
          {clinics.map(c => (
            <button
              key={c.id}
              onClick={() => { setActiveClinic(c); setActiveRoomId(null); }}
              className={`flex items-center justify-between group px-4 py-3 rounded-xl text-sm transition-all ${activeClinic?.id === c.id ? "bg-primary text-primary-foreground shadow-lg scale-102" : "hover:bg-accent/50 text-muted-foreground"}`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`h-4 w-4 ${activeClinic?.id === c.id ? "text-primary-foreground" : "text-primary"}`} />
                <span className="font-semibold">{c.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Détails du site */}
        <div className="md:col-span-3 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {activeClinic ? (
            <>
              {/* Carte Infos */}
              <Card className="border-none shadow-xl bg-gradient-to-br from-white to-accent/5 overflow-hidden">
                <div className="h-1.5 bg-primary w-full" />
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-2xl text-primary font-black uppercase tracking-tight">{activeClinic.name}</CardTitle>
                    <CardDescription>Configuration administrative du site</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => {
                    setAlertConfig({
                      open: true,
                      title: `Supprimer le site ${activeClinic.name} ?`,
                      description: "Toutes les données associées (salles, planning, etc.) seront perdues. Cette action est irréversible.",
                      action: async () => {
                        await api.delete(`/resources/clinics/${activeClinic.id}`)
                        fetchClinics()
                      }
                    })
                  }}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nom public</Label>
                      <Input value={activeClinic.name} onChange={e => handleUpdateClinicField("name", e.target.value)} className="bg-white border-accent/20 focus:border-primary font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email contact</Label>
                      <Input value={activeClinic.email || ""} onChange={e => handleUpdateClinicField("email", e.target.value)} className="bg-white border-accent/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Téléphone</Label>
                      <Input value={activeClinic.phone || ""} onChange={e => handleUpdateClinicField("phone", e.target.value)} className="bg-white border-accent/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Adresse complète</Label>
                      <Input value={activeClinic.address || ""} onChange={e => handleUpdateClinicField("address", e.target.value)} className="bg-white border-accent/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salles & Hospit */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-accent/20 shadow-lg h-full">
                  <CardHeader className="flex flex-row items-center justify-between border-b bg-accent/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><DoorOpen className="h-5 w-5" /></div>
                      <CardTitle className="text-lg font-bold">Locaux & Équipements</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsRoomDialogOpen(true)} className="border-primary text-primary hover:bg-primary hover:text-white transition-all"><Plus className="h-4 w-4" /></Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-3">
                      {activeClinic.rooms?.map(room => {
                        const Icon = ROOM_TYPE_ICONS[room.type] || DoorOpen
                        return (
                          <div 
                            key={room.id} 
                            onClick={() => setActiveRoomId(room.id)}
                            className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all hover:border-primary/50 ${activeRoomId === room.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-accent/20 bg-accent/5"}`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`h-4 w-4 ${activeRoomId === room.id ? "text-primary" : "text-muted-foreground"}`} />
                              <div>
                                <p className="text-sm font-bold">{room.name}</p>
                                <Select value={room.type} onValueChange={(val: string) => handleUpdateRoomType(room.id, val as RoomType)}>
                                  <SelectTrigger className="h-auto p-0 border-none bg-transparent shadow-none focus:ring-0 text-[10px] uppercase font-black text-muted-foreground hover:text-primary transition-colors">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(ROOM_TYPE_LABELS).map(([val, label]) => (
                                      <SelectItem key={val} value={val} className="text-xs uppercase font-bold">{label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/50 hover:text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id); }}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-accent/20 shadow-lg h-full overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between border-b bg-accent/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600"><Bed className="h-5 w-5" /></div>
                      <CardTitle className="text-lg font-bold">Capacités d'Hospit</CardTitle>
                    </div>
                    {activeRoom?.type === "hospitalization" && (
                      <Button variant="outline" size="sm" onClick={() => setIsRoomSlotDialogOpen(true)} className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all"><Plus className="h-4 w-4" /></Button>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6 h-[300px] overflow-y-auto">
                    {!activeRoom ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4 grayscale opacity-50">
                        <DoorOpen className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground italic">Sélectionnez une salle pour voir ses configurations.</p>
                      </div>
                    ) : activeRoom.type !== "hospitalization" ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 uppercase text-[10px] font-black py-1">Salle technique</Badge>
                        <p className="text-sm text-muted-foreground max-w-[200px]">Cette salle ne dispose pas d'emplacements d'hospitalisation.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {activeRoom.slots?.map(slot => (
                          <div key={slot.id} className="flex items-center justify-between p-3 border rounded-xl bg-blue-50/30 border-blue-100 group hover:shadow-sm transition-all">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-white border-blue-200 text-blue-700 hover:bg-white font-bold">{slot.box_reference}</Badge>
                              <span className="text-[10px] uppercase font-black text-blue-400">{slot.type}</span>
                            </div>
                            <button onClick={() => handleDeleteSlot(activeRoom.id, slot.id)} className="text-destructive/30 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        ))}
                        {activeRoom.slots?.length === 0 && <p className="col-span-2 text-center text-sm text-muted-foreground italic py-12">Aucun box configuré.</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Horaires */}
              <Card className="border-accent/20 shadow-lg border-l-4 border-l-primary overflow-hidden">
                <CardHeader className="bg-accent/5 border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Clock className="h-5 w-5" /></div>
                    <CardTitle className="text-lg font-bold">Horaires d'exploitation</CardTitle>
                  </div>
                  <CardDescription>Plages horaires utilisées pour le moteur de réservation et les agendas.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 px-4 sm:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                      const dayLabels: Record<string, string> = { monday: "Lun", tuesday: "Mar", wednesday: "Mer", thursday: "Jeu", friday: "Ven", saturday: "Sam", sunday: "Dim" }
                      const slots = activeClinic.opening_hours?.[day] || []
                      return (
                        <div key={day} className="flex flex-col gap-3 p-4 border rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors group">
                          <p className="text-xs font-black uppercase text-primary border-b border-primary/10 pb-2">{dayLabels[day]}</p>
                          <div className="flex flex-col gap-2 min-h-[60px]">
                            {slots.map((s: any, idx: number) => (
                              <div key={idx} className="flex flex-col text-[10px] font-bold bg-white p-2 rounded-lg border border-primary/10 shadow-sm text-center">
                                <span className="text-green-600">{s.open} - {s.close}</span>
                              </div>
                            ))}
                            {slots.length === 0 && <span className="text-[10px] text-destructive/50 font-bold uppercase py-2 italic text-center">Fermé</span>}
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase font-black hover:bg-primary/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">Éditer</Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Congés & Fermetures */}
              <Card className="border-accent/20 shadow-lg border-l-4 border-l-orange-400 overflow-hidden">
                <CardHeader className="bg-accent/5 border-b pb-4">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Calendar className="h-5 w-5" /></div>
                      <CardTitle className="text-lg font-bold">Congés & Fermetures Exceptionnelles</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsClosureDialogOpen(true)} className="border-orange-400 text-orange-600 hover:bg-orange-400 hover:text-white text-[10px] uppercase font-black transition-all"><Plus className="h-4 w-4 mr-2" /> Ajouter</Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4">
                    {activeClinic.closures?.map(closure => (
                      <div key={closure.id} className="flex items-center gap-4 p-4 border rounded-2xl bg-orange-50/30 border-orange-100 hover:shadow-md transition-all group">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-orange-800 uppercase tracking-tight">{closure.description}</span>
                          <span className="text-[10px] font-bold text-orange-600">Du {new Date(closure.start_date).toLocaleDateString()} au {new Date(closure.end_date).toLocaleDateString()}</span>
                        </div>
                        <button onClick={() => handleDeleteClosure(closure.id)} className="p-2 rounded-full hover:bg-orange-100 text-orange-300 hover:text-orange-600 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                    {activeClinic.closures?.length === 0 && <p className="text-sm text-muted-foreground italic py-4">Aucune fermeture exceptionnelle prévue.</p>}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center border-4 border-dashed rounded-3xl p-24 text-center bg-accent/5">
              <div className="p-6 bg-white rounded-full shadow-2xl mb-6"><Building2 className="h-16 w-12 text-primary/20" /></div>
              <h2 className="text-2xl font-black text-primary/40 uppercase tracking-tighter">Sélectionnez un site</h2>
              <p className="text-muted-foreground max-w-xs mt-2">Choisissez un cabinet dans la colonne de gauche pour configurer ses ressources.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- DIALOGS --- */}

      {/* Add Room Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black text-primary text-xl tracking-tight">Ajouter une salle</DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">Créez un nouveau local technique ou de consultation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="room-name" className="text-xs font-bold uppercase text-muted-foreground">Nom de la salle</Label>
              <Input id="room-name" value={newRoomData.name} onChange={(e) => setNewRoomData({...newRoomData, name: e.target.value})} placeholder="ex: Consultation 1" className="font-semibold" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="room-type" className="text-xs font-bold uppercase text-muted-foreground">Vocation de la salle</Label>
              <Select value={newRoomData.type} onValueChange={(val: string) => setNewRoomData({...newRoomData, type: val as RoomType})}>
                <SelectTrigger id="room-type" className="font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROOM_TYPE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val} className="font-bold uppercase text-xs">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsRoomDialogOpen(false)} className="font-bold">Annuler</Button>
            <Button onClick={handleAddRoomSubmit} className="font-black uppercase tracking-widest text-xs">Créer la salle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Slot Dialog */}
      <Dialog open={isSlotDialogOpen} onOpenChange={setIsRoomSlotDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black text-blue-600 text-xl tracking-tight">Ajouter un box/cage</DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">Configurez une unité d'accueil pour l'hospitalisation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="slot-ref" className="text-xs font-bold uppercase text-muted-foreground">Référence de l'unité</Label>
              <Input id="slot-ref" value={newSlotData.box_reference} onChange={(e) => setNewSlotData({...newSlotData, box_reference: e.target.value})} placeholder="ex: Box A1" className="font-semibold" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot-type" className="text-xs font-bold uppercase text-muted-foreground">Type d'unité</Label>
              <Select value={newSlotData.type} onValueChange={(val: string) => setNewSlotData({...newSlotData, type: val as SlotType})}>
                <SelectTrigger id="slot-type" className="font-bold text-blue-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cage" className="font-bold uppercase text-xs">Cage</SelectItem>
                  <SelectItem value="box" className="font-bold uppercase text-xs">Box</SelectItem>
                  <SelectItem value="parc" className="font-bold uppercase text-xs">Parc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsRoomSlotDialogOpen(false)} className="font-bold">Annuler</Button>
            <Button onClick={handleAddSlotSubmit} className="bg-blue-600 hover:bg-blue-700 font-black uppercase tracking-widest text-xs">Ajouter l'unité</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Closure Dialog */}
      <Dialog open={isClosureDialogOpen} onOpenChange={setIsClosureDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black text-orange-600 text-xl tracking-tight">Planifier une fermeture</DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">Définissez une période de congés ou de fermeture exceptionnelle.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="closure-desc" className="text-xs font-bold uppercase text-muted-foreground">Motif ou libellé</Label>
              <Input id="closure-desc" value={newClosureData.description} onChange={(e) => setNewClosureData({...newClosureData, description: e.target.value})} placeholder="ex: Vacances d'été" className="font-semibold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="closure-start" className="text-xs font-bold uppercase text-muted-foreground">Date de début</Label>
                <Input id="closure-start" type="date" value={newClosureData.start_date} onChange={(e) => setNewClosureData({...newClosureData, start_date: e.target.value})} className="font-bold" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="closure-end" className="text-xs font-bold uppercase text-muted-foreground">Date de fin</Label>
                <Input id="closure-end" type="date" value={newClosureData.end_date} onChange={(e) => setNewClosureData({...newClosureData, end_date: e.target.value})} className="font-bold" />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsClosureDialogOpen(false)} className="font-bold">Annuler</Button>
            <Button onClick={handleAddClosureSubmit} className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs">Enregistrer la période</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generic Alert Confirmation */}
      <AlertDialog open={alertConfig.open} onOpenChange={(val: boolean) => setAlertConfig({...alertConfig, open: val})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive/10 rounded-full text-destructive"><AlertTriangle className="h-6 w-6" /></div>
              <AlertDialogTitle className="text-xl font-black uppercase tracking-tight">{alertConfig.title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="ghost" className="font-bold">Annuler</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                variant="destructive" 
                className="font-black uppercase tracking-widest text-xs"
                onClick={() => {
                  alertConfig.action();
                  setAlertConfig({...alertConfig, open: false});
                }}
              >
                Confirmer
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
