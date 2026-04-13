import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, Building2, DoorOpen, Bed, Trash2, 
  Stethoscope, Scissors, Activity, Search,
  Clock, Calendar, AlertTriangle, X, Users,
  UserPlus, Check
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

interface ClinicClosure {
  id: number
  start_date: string
  end_date: string
  description: string
}

interface OpeningHoursSlot {
  open: string
  close: string
}

interface StaffMember {
  id: number
  full_name: string
  email: string
  role: string
}

interface Clinic {
  id: number
  name: string
  address: string
  phone: string
  email: string
  opening_hours: Record<string, OpeningHoursSlot[]>
  rooms: Room[]
  closures: ClinicClosure[]
  staff: StaffMember[]
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

const DAYS_FR = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche"
}

export const Resources = () => {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [allUsers, setAllUsers] = useState<StaffMember[]>([])
  const [activeClinic, setActiveClinic] = useState<Clinic | null>(null)
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Modals state
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [newRoomData, setNewRoomData] = useState({ name: "", type: "consultation" as RoomType })
  
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false)
  const [newSlotData, setNewSlotData] = useState({ box_reference: "", type: "cage" as SlotType })

  const [isClosureDialogOpen, setIsClosureDialogOpen] = useState(false)
  const [newClosureData, setNewClosureData] = useState({ description: "", start_date: "", end_date: "" })

  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false)
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [editingSlots, setEditingSlots] = useState<OpeningHoursSlot[]>([])

  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false)

  const [alertConfig, setAlertConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({ open: false, title: "", description: "", action: () => {} })

  useEffect(() => {
    fetchClinics()
    fetchUsers()
  }, [])

  const fetchClinics = async () => {
    try {
      const response = await api.get("/resources/clinics")
      setClinics(response.data)
      if (response.data.length > 0) {
        if (!activeClinic) setActiveClinic(response.data[0])
        else {
          const updated = response.data.find((c: Clinic) => c.id === activeClinic.id)
          if (updated) setActiveClinic(updated)
        }
      }
    } catch (error) {
      console.error("Failed to fetch clinics", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/")
      setAllUsers(response.data)
    } catch (error) {
      console.error("Failed to fetch users", error)
    }
  }

  const handleUpdateClinicField = async (field: keyof Clinic, value: any) => {
    if (!activeClinic) return
    try {
      await api.put(`/resources/clinics/${activeClinic.id}`, { [field]: value })
      const updatedClinic = { ...activeClinic, [field]: value }
      setActiveClinic(updatedClinic)
      setClinics(clinics.map(c => c.id === activeClinic.id ? updatedClinic : c))
    } catch (error) {
      console.error("Failed to update clinic", error)
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

  const handleAddRoomSubmit = async () => {
    if (!activeClinic || !newRoomData.name) return
    try {
      const response = await api.post("/resources/rooms", {
        ...newRoomData,
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
      setActiveClinic({ ...activeClinic, rooms: updatedRooms })
    } catch (error) {
      console.error("Failed to update room type", error)
    }
  }

  const handleDeleteRoom = (roomId: number) => {
    setAlertConfig({
      open: true,
      title: "Supprimer la salle ?",
      description: "Cette action supprimera également tous les emplacements liés. Cette opération est irréversible.",
      action: async () => {
        await api.delete(`/resources/rooms/${roomId}`)
        const updatedRooms = activeClinic!.rooms.filter(r => r.id !== roomId)
        setActiveClinic({ ...activeClinic!, rooms: updatedRooms })
        if (activeRoomId === roomId) setActiveRoomId(null)
      }
    })
  }

  const handleAddSlotSubmit = async () => {
    if (!activeRoomId || !newSlotData.box_reference) return
    try {
      const response = await api.post("/resources/slots", {
        ...newSlotData,
        room_id: activeRoomId
      })
      const updatedRooms = activeClinic!.rooms.map(r => 
        r.id === activeRoomId ? { ...r, slots: [...(r.slots || []), response.data] } : r
      )
      setActiveClinic({ ...activeClinic!, rooms: updatedRooms })
      setIsSlotDialogOpen(false)
      setNewSlotData({ box_reference: "", type: "cage" })
    } catch (error) {
      console.error("Failed to add slot", error)
    }
  }

  const handleDeleteSlot = (roomId: number, slotId: number) => {
    setAlertConfig({
      open: true,
      title: "Supprimer l'emplacement ?",
      description: "L'unité d'hospitalisation sera définitivement retirée.",
      action: async () => {
        await api.delete(`/resources/slots/${slotId}`)
        const updatedRooms = activeClinic!.rooms.map(r => 
          r.id === roomId ? { ...r, slots: r.slots.filter(s => s.id !== slotId) } : r
        )
        setActiveClinic({ ...activeClinic!, rooms: updatedRooms })
      }
    })
  }

  const handleOpenHoursDialog = (day: string) => {
    setEditingDay(day)
    setEditingSlots(activeClinic?.opening_hours?.[day] || [])
    setIsHoursDialogOpen(true)
  }

  const handleSaveHours = async () => {
    if (!editingDay || !activeClinic) return
    const updatedHours = {
      ...activeClinic.opening_hours,
      [editingDay]: editingSlots.filter(s => s.open && s.close)
    }
    await handleUpdateClinicField("opening_hours", updatedHours)
    setIsHoursDialogOpen(false)
  }

  const handleAddClosureSubmit = async () => {
    if (!activeClinic || !newClosureData.description) return
    try {
      const response = await api.post("/resources/closures", {
        ...newClosureData,
        clinic_id: activeClinic.id
      })
      setActiveClinic({
        ...activeClinic,
        closures: [...(activeClinic.closures || []), response.data]
      })
      setIsClosureDialogOpen(false)
      setNewClosureData({ description: "", start_date: "", end_date: "" })
    } catch (error) {
      console.error("Failed to add closure", error)
    }
  }

  const handleDeleteClosure = (closureId: number) => {
    setAlertConfig({
      open: true,
      title: "Supprimer la fermeture ?",
      description: "Cette période sera à nouveau disponible pour l'activité du cabinet.",
      action: async () => {
        await api.delete(`/resources/closures/${closureId}`)
        setActiveClinic({
          ...activeClinic!,
          closures: activeClinic!.closures.filter(c => c.id !== closureId)
        })
      }
    })
  }

  const toggleStaffAssignment = async (userId: number) => {
    if (!activeClinic) return
    const isAssigned = activeClinic.staff?.some(u => u.id === userId)
    
    // Pour cet utilisateur, on doit envoyer la nouvelle liste de cliniques
    // Mais l'API backend attend {user_id, clinic_ids}. 
    // On va tricher un peu pour le moment : on récupère les cliniques de l'utilisateur
    // ou on implémente un toggle simple si possible.
    
    // Logique simplifiée pour le prototype :
    try {
      // On récupère les IDs actuels des cliniques du membre (on simule car on ne les a pas tous ici)
      // En production, il faudrait une API 'GET /users/{id}'
      const currentStaffMember = allUsers.find(u => u.id === userId)
      if (!currentStaffMember) return

      // Pour simplifier, on envoie juste l'ID de la clinique active (toggle)
      // Note: Le backend actuel écrase la liste. 
      // Il faudrait une logique plus fine, mais restons sur le contrat d'API établi.
      const userClinicsRes = await api.get(`/users/`) // Mock: en vrai on devrait avoir les cliniques par user
      const userInDb = userClinicsRes.data.find((u: any) => u.id === userId)
      
      let newClinicIds = (userInDb.clinics || []).map((c: any) => c.id)
      if (isAssigned) {
        newClinicIds = newClinicIds.filter((id: number) => id !== activeClinic.id)
      } else {
        newClinicIds = [...newClinicIds, activeClinic.id]
      }

      await api.post("/resources/staff-assignments", {
        user_id: userId,
        clinic_ids: newClinicIds
      })
      
      fetchClinics() // Refresh everything
    } catch (error) {
      console.error("Failed to toggle staff assignment", error)
    }
  }

  const activeRoom = activeClinic?.rooms.find(r => r.id === activeRoomId)

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-muted-foreground italic">Chargement des ressources...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Ressources & Sites</h1>
          <p className="text-sm text-muted-foreground">Configuration des cliniques, salles et capacités d'accueil.</p>
        </div>
        <Button onClick={handleCreateClinic} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nouveau site
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider px-2">Liste des sites</p>
            <div className="space-y-1">
              {clinics.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setActiveClinic(c); setActiveRoomId(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeClinic?.id === c.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent"}`}
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeClinic ? (
            <>
              {/* Informations du site */}
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{activeClinic.name}</CardTitle>
                    <CardDescription>Informations de contact et adresse du site.</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => {
                    setAlertConfig({
                      open: true,
                      title: `Supprimer le site ?`,
                      description: `Êtes-vous sûr de vouloir supprimer définitivement le site "${activeClinic.name}" ?`,
                      action: async () => {
                        await api.delete(`/resources/clinics/${activeClinic.id}`)
                        fetchClinics()
                        setActiveClinic(null)
                      }
                    })
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nom du site</Label>
                      <Input value={activeClinic.name} onChange={e => handleUpdateClinicField("name", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Email</Label>
                      <Input value={activeClinic.email || ""} onChange={e => handleUpdateClinicField("email", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Téléphone</Label>
                      <Input value={activeClinic.phone || ""} onChange={e => handleUpdateClinicField("phone", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Adresse</Label>
                      <Input value={activeClinic.address || ""} onChange={e => handleUpdateClinicField("address", e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salles & Hospit */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                    <CardTitle className="text-md font-medium flex items-center gap-2">
                      <DoorOpen className="h-4 w-4 text-primary" /> Locaux
                    </CardTitle>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setIsRoomDialogOpen(true)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1">
                    <div className="space-y-2">
                      {activeClinic.rooms?.map(room => {
                        const Icon = ROOM_TYPE_ICONS[room.type] || DoorOpen
                        return (
                          <div 
                            key={room.id}
                            onClick={() => setActiveRoomId(room.id)}
                            className={`flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all ${activeRoomId === room.id ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-accent/50 border-transparent bg-accent/10"}`}
                          >
                            <div className="flex items-center gap-3 text-left">
                              <div className={`p-1.5 rounded-md ${activeRoomId === room.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-medium">{room.name}</p>
                                <Select value={room.type} onValueChange={(val: string) => handleUpdateRoomType(room.id, val as RoomType)}>
                                  <SelectTrigger className="h-auto p-0 border-none bg-transparent shadow-none focus:ring-0 text-[10px] text-muted-foreground uppercase tracking-tight font-semibold hover:text-primary">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(ROOM_TYPE_LABELS).map(([val, label]) => (
                                      <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id); }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )
                      })}
                      {activeClinic.rooms?.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-4">Aucune salle.</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                    <CardTitle className="text-md font-medium flex items-center gap-2">
                      <Bed className="h-4 w-4 text-primary" /> Hospitalisation
                    </CardTitle>
                    {activeRoom?.type === "hospitalization" && (
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setIsSlotDialogOpen(true)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4 flex-1">
                    {!activeRoom ? (
                      <p className="text-xs text-muted-foreground text-center py-8">Sélectionnez une salle.</p>
                    ) : activeRoom.type !== "hospitalization" ? (
                      <div className="text-center py-8 space-y-2">
                        <Badge variant="outline" className="text-[10px] font-semibold uppercase">Salle technique</Badge>
                        <p className="text-xs text-muted-foreground">Pas d'hospitalisation ici.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {activeRoom.slots?.map(slot => (
                          <div key={slot.id} className="flex items-center justify-between px-2 py-1.5 bg-primary/5 rounded border text-sm">
                            <span className="font-medium text-xs truncate">{slot.box_reference}</span>
                            <button onClick={() => handleDeleteSlot(activeRoom.id, slot.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {activeRoom.slots?.length === 0 && <p className="col-span-2 text-xs text-muted-foreground italic text-center py-4">Aucun box.</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Équipe et Horaires */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-md font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" /> Équipe du site
                    </CardTitle>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsStaffDialogOpen(true)}>
                      <UserPlus className="h-3.5 w-3.5 mr-1" /> Gérer
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {activeClinic.staff?.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-2 border rounded-lg bg-accent/5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {member.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-medium">{member.full_name}</p>
                              <p className="text-[10px] text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {activeClinic.staff?.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-4">Aucun membre assigné.</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-md font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> Horaires d'exploitation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(Object.keys(DAYS_FR) as Array<keyof typeof DAYS_FR>).map(day => {
                        const slots = activeClinic.opening_hours?.[day] || []
                        return (
                          <div key={day} className="flex flex-col gap-1.5 p-2 border rounded-md bg-accent/5">
                            <p className="text-[9px] font-bold uppercase text-muted-foreground">{DAYS_FR[day]}</p>
                            <div className="min-h-[30px]">
                              {slots.map((s, idx) => (
                                <p key={idx} className="text-[9px] font-medium text-center bg-white border rounded">{s.open}-{s.close}</p>
                              ))}
                              {slots.length === 0 && <p className="text-[9px] text-muted-foreground/50 text-center">Fermé</p>}
                            </div>
                            <Button variant="ghost" size="sm" className="h-5 text-[8px] uppercase font-bold" onClick={() => handleOpenHoursDialog(day)}>Éditer</Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Congés & Fermetures */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-md font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Congés & Fermetures
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setIsClosureDialogOpen(true)}>
                    <Plus className="h-3 w-3 mr-1" /> Ajouter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {activeClinic.closures?.map(c => (
                      <div key={c.id} className="flex items-center gap-3 pl-3 pr-1 py-1 bg-orange-50 border border-orange-100 rounded-full text-xs">
                        <span className="font-medium text-orange-800">{c.description}</span>
                        <span className="text-orange-600/70 text-[10px]">({new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()})</span>
                        <button onClick={() => handleDeleteClosure(c.id)} className="p-1 hover:bg-orange-200 rounded-full text-orange-400 hover:text-orange-600 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {activeClinic.closures?.length === 0 && <p className="text-xs text-muted-foreground italic">Aucune fermeture exceptionnelle.</p>}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl text-muted-foreground space-y-4">
              <Building2 className="h-12 w-12 opacity-20" />
              <p>Sélectionnez un site pour afficher sa configuration.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Staff Management Dialog */}
      <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Gestion de l'équipe</DialogTitle>
            <DialogDescription>Assignez les membres autorisés à travailler sur ce site.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto pr-2">
            {allUsers.map(user => {
              const isAssigned = activeClinic?.staff?.some(u => u.id === user.id)
              return (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isAssigned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {user.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{user.role}</p>
                    </div>
                  </div>
                  <Button 
                    variant={isAssigned ? "default" : "outline"} 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => toggleStaffAssignment(user.id)}
                  >
                    {isAssigned ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsStaffDialogOpen(false)}>Terminer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ajouter une salle</DialogTitle>
            <DialogDescription>Définissez l'usage de ce local.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nom de la salle</Label>
              <Input value={newRoomData.name} onChange={e => setNewRoomData({...newRoomData, name: e.target.value})} placeholder="ex: Consultation 1" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vocation</Label>
              <Select value={newRoomData.type} onValueChange={v => setNewRoomData({...newRoomData, type: v as RoomType})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROOM_TYPE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRoomDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddRoomSubmit}>Créer la salle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ajouter un box/cage</DialogTitle>
            <DialogDescription>Unité d'accueil pour l'hospitalisation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Référence</Label>
              <Input value={newSlotData.box_reference} onChange={e => setNewSlotData({...newSlotData, box_reference: e.target.value})} placeholder="ex: Box A1" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Type</Label>
              <Select value={newSlotData.type} onValueChange={v => setNewSlotData({...newSlotData, type: v as SlotType})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cage">Cage</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="parc">Parc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSlotDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddSlotSubmit}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Horaires : {editingDay ? DAYS_FR[editingDay as keyof typeof DAYS_FR] : ""}</DialogTitle>
            <DialogDescription>Définissez les plages d'ouverture.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingSlots.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-accent/30 p-3 rounded-lg border">
                <div className="flex-1 grid gap-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Ouverture</Label>
                  <Input type="time" value={slot.open} onChange={e => {
                    const next = [...editingSlots]; next[idx].open = e.target.value; setEditingSlots(next);
                  }} />
                </div>
                <div className="flex-1 grid gap-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Fermeture</Label>
                  <Input type="time" value={slot.close} onChange={e => {
                    const next = [...editingSlots]; next[idx].close = e.target.value; setEditingSlots(next);
                  }} />
                </div>
                <Button variant="ghost" size="icon" className="mt-5" onClick={() => setEditingSlots(editingSlots.filter((_, i) => i !== idx))}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => setEditingSlots([...editingSlots, { open: "08:00", close: "12:00" }])}>
              <Plus className="h-3 w-3 mr-2" /> Ajouter une plage
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsHoursDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveHours}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isClosureDialogOpen} onOpenChange={setIsClosureDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Planifier une fermeture</DialogTitle>
            <DialogDescription>Vacances ou fermeture exceptionnelle.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Motif</Label>
              <Input value={newClosureData.description} onChange={e => setNewClosureData({...newClosureData, description: e.target.value})} placeholder="ex: Vacances d'été" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Début</Label>
                <Input type="date" value={newClosureData.start_date} onChange={e => setNewClosureData({...newClosureData, start_date: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Fin</Label>
                <Input type="date" value={newClosureData.end_date} onChange={e => setNewClosureData({...newClosureData, end_date: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsClosureDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddClosureSubmit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertConfig.open} onOpenChange={v => setAlertConfig({...alertConfig, open: v})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive/10 rounded-full text-destructive"><AlertTriangle className="h-5 w-5" /></div>
              <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm font-medium">{alertConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => { alertConfig.action(); setAlertConfig({...alertConfig, open: false}); }} className="bg-destructive hover:bg-destructive/90">Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
