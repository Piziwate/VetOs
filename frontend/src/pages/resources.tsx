import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, Building2, DoorOpen, Bed, Trash2, 
  Stethoscope, Scissors, Activity, Search,
  Clock, Calendar as CalendarIcon, AlertTriangle, X, Users,
  UserPlus, Check, LayoutGrid, Timer
} from "lucide-react"
import api from "@/lib/api"
import type { Clinic, RoomType, SlotType, OpeningHoursSlot, StaffMember } from "@/types/resource"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  consultation: "Consultation",
  surgery: "Chirurgie",
  pre_op: "Pré-opératoire",
  imaging: "Imagerie",
  hospitalization: "Hospitalisation"
}

const ROOM_TYPE_ICONS: Record<RoomType, React.ElementType> = {
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
  const [newClosureData, setNewClosureData] = useState<{
    description: string;
    start_date: Date | undefined;
    end_date: Date | undefined;
  }>({ description: "", start_date: undefined, end_date: undefined })

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

  const fetchClinics = useCallback(async () => {
    try {
      const response = await api.get("/resources/clinics")
      const data = response.data as Clinic[]
      setClinics(data)
      
      // Update active clinic only if needed, without triggering infinite loop
      if (data.length > 0) {
        setActiveClinic(current => {
          if (!current) return data[0]
          const updated = data.find(c => c.id === current.id)
          return updated || data[0]
        })
      }
    } catch (error) {
      console.error("Failed to fetch clinics", error)
    } finally {
      setLoading(false)
    }
  }, []) // Removed activeClinic from dependencies

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get("/users/")
      setAllUsers(response.data)
    } catch (error) {
      console.error("Failed to fetch users", error)
    }
  }, [])

  useEffect(() => {
    fetchClinics()
    fetchUsers()
  }, [fetchClinics, fetchUsers])

  const handleUpdateClinicField = async (field: keyof Clinic, value: string | number | boolean | Record<string, unknown> | Array<unknown>) => {
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
      const updatedClinic = { ...activeClinic, rooms: updatedRooms }
      setActiveClinic(updatedClinic)
      setClinics(prev => prev.map(c => c.id === activeClinic.id ? updatedClinic : c))
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
        try {
          await api.delete(`/resources/rooms/${roomId}`)
          if (activeClinic) {
            const updatedRooms = activeClinic.rooms.filter(r => r.id !== roomId)
            const updatedClinic = { ...activeClinic, rooms: updatedRooms }
            setActiveClinic(updatedClinic)
            setClinics(prev => prev.map(c => c.id === activeClinic.id ? updatedClinic : c))
          }
          if (activeRoomId === roomId) setActiveRoomId(null)
        } catch (error) {
          console.error("Failed to delete room", error)
        }
      }
    })
  }

  const handleAddSlotSubmit = async () => {
    if (!activeRoomId || !newSlotData.box_reference || !activeClinic) return
    try {
      const response = await api.post("/resources/slots", {
        ...newSlotData,
        room_id: activeRoomId
      })
      const updatedRooms = activeClinic.rooms.map(r => 
        r.id === activeRoomId ? { ...r, slots: [...(r.slots || []), response.data] } : r
      )
      const updatedClinic = { ...activeClinic, rooms: updatedRooms }
      setActiveClinic(updatedClinic)
      setClinics(prev => prev.map(c => c.id === activeClinic.id ? updatedClinic : c))
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
        try {
          await api.delete(`/resources/slots/${slotId}`)
          if (activeClinic) {
            const updatedRooms = activeClinic.rooms.map(r => 
              r.id === roomId ? { ...r, slots: r.slots.filter(s => s.id !== slotId) } : r
            )
            const updatedClinic = { ...activeClinic, rooms: updatedRooms }
            setActiveClinic(updatedClinic)
            setClinics(prev => prev.map(c => c.id === activeClinic.id ? updatedClinic : c))
          }
        } catch (error) {
          console.error("Failed to delete slot", error)
        }
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
    if (!activeClinic || !newClosureData.description || !newClosureData.start_date || !newClosureData.end_date) return
    try {
      const response = await api.post("/resources/closures", {
        description: newClosureData.description,
        start_date: format(newClosureData.start_date, "yyyy-MM-dd"),
        end_date: format(newClosureData.end_date, "yyyy-MM-dd"),
        clinic_id: activeClinic.id
      })
      const updatedClinic = {
        ...activeClinic,
        closures: [...(activeClinic.closures || []), response.data]
      }
      setActiveClinic(updatedClinic)
      setClinics(prev => prev.map(c => c.id === activeClinic.id ? updatedClinic : c))
      setIsClosureDialogOpen(false)
      setNewClosureData({ description: "", start_date: undefined, end_date: undefined })
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
        try {
          await api.delete(`/resources/closures/${closureId}`)
          if (activeClinic) {
            const updatedClinic = {
              ...activeClinic,
              closures: activeClinic.closures.filter(c => c.id !== closureId)
            }
            setActiveClinic(updatedClinic)
            setClinics(prev => prev.map(c => c.id === activeClinic.id ? updatedClinic : c))
          }
        } catch (error) {
          console.error("Failed to delete closure", error)
        }
      }
    })
  }

  const toggleStaffAssignment = async (userId: number) => {
    if (!activeClinic) return
    const isAssigned = activeClinic.staff?.some(u => u.id === userId)
    
    try {
      const userClinicsRes = await api.get(`/users/`)
      const userInDb = userClinicsRes.data.find((u: { id: number; clinics?: { id: number }[] }) => u.id === userId)
      
      let newClinicIds = (userInDb?.clinics || []).map((c: { id: number }) => c.id) as number[]
      if (isAssigned) {
        newClinicIds = newClinicIds.filter((id: number) => id !== activeClinic.id)
      } else {
        newClinicIds = [...newClinicIds, activeClinic.id]
      }

      await api.post("/resources/staff-assignments", {
        user_id: userId,
        clinic_ids: newClinicIds
      })
      
      fetchClinics()
    } catch (error) {
      console.error("Failed to toggle staff assignment", error)
    }
  }

  const activeRoom = activeClinic?.rooms.find(r => r.id === activeRoomId)

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-muted-foreground italic">Chargement des ressources...</div>

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Ressources</h2>
          <p className="text-sm text-muted-foreground">Configuration des cliniques, infrastructures et planning.</p>
        </div>
        <Button onClick={handleCreateClinic} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un site
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider px-2">Sites du groupe</p>
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

        {/* Content with Tabs */}
        <div className="space-y-6">
          {activeClinic ? (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Administration
                </TabsTrigger>
                <TabsTrigger value="infrastructure" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" /> Infrastructure
                </TabsTrigger>
                <TabsTrigger value="planning" className="flex items-center gap-2">
                  <Timer className="h-4 w-4" /> Planning
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-8 animate-in fade-in duration-300">
                {/* Informations du site */}
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Coordonnées du site</CardTitle>
                      <CardDescription>Informations de contact public du cabinet.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => {
                      setAlertConfig({
                        open: true,
                        title: `Supprimer ce site ?`,
                        description: `Toutes les données associées seront perdues.`,
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

                {/* Équipe */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" /> Équipe autorisée
                      </CardTitle>
                      <CardDescription>Personnel ayant accès à ce site.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsStaffDialogOpen(true)}>
                      <UserPlus className="h-3.5 w-3.5 mr-2" /> Gérer l'accès
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeClinic.staff?.map(member => (
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
                      {activeClinic.staff?.length === 0 && <p className="col-span-full text-sm text-muted-foreground italic text-center py-8">Aucun membre assigné à ce site.</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="infrastructure" className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Salles */}
                  <Card className="flex flex-col border-none shadow-none bg-accent/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                      <CardTitle className="text-md font-medium flex items-center gap-2">
                        <DoorOpen className="h-4 w-4 text-primary" /> Locaux techniques
                      </CardTitle>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setIsRoomDialogOpen(true)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-4 flex-1 px-4">
                      <div className="space-y-2">
                        {activeClinic.rooms?.map(room => {
                          const Icon = ROOM_TYPE_ICONS[room.type] || DoorOpen
                          return (
                            <div 
                              key={room.id}
                              onClick={() => setActiveRoomId(room.id)}
                              className={`flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all ${activeRoomId === room.id ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm" : "hover:bg-accent/50 border-transparent bg-background/50"}`}
                            >
                              <div className="flex items-center gap-3 text-left">
                                <div className={`p-1.5 rounded-md ${activeRoomId === room.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-sm font-medium">{room.name}</p>
                                  <Select value={room.type} onValueChange={(val: string) => handleUpdateRoomType(room.id, val as RoomType)}>
                                    <SelectTrigger className="h-auto p-0 border-none bg-transparent shadow-none focus:ring-0 text-[10px] text-muted-foreground uppercase font-semibold hover:text-primary transition-colors">
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
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors" onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id); }}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )
                        })}
                        {activeClinic.rooms?.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-8">Aucun local configuré.</p>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hospitalisation */}
                  <Card className="flex flex-col border-none shadow-none bg-accent/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                      <CardTitle className="text-md font-medium flex items-center gap-2">
                        <Bed className="h-4 w-4 text-primary" /> Hospitalisation
                      </CardTitle>
                      {activeRoom?.type === "hospitalization" && (
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setIsSlotDialogOpen(true)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="pt-4 flex-1 px-4">
                      {!activeRoom ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                          <DoorOpen className="h-8 w-8 text-muted-foreground/20" />
                          <p className="text-xs text-muted-foreground">Sélectionnez un local à gauche.</p>
                        </div>
                      ) : activeRoom.type !== "hospitalization" ? (
                        <div className="text-center py-12 space-y-3">
                          <Badge variant="outline" className="text-[10px] font-semibold uppercase px-3 py-0.5">Local technique</Badge>
                          <p className="text-xs text-muted-foreground max-w-[180px] mx-auto">Ce local n'est pas configuré pour accueillir des hospitalisations.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {activeRoom.slots?.map(slot => (
                            <div key={slot.id} className="flex items-center justify-between px-3 py-2 bg-background/50 rounded-lg border border-transparent hover:border-primary/30 transition-all group shadow-sm">
                              <span className="font-semibold text-xs truncate">{slot.box_reference}</span>
                              <button onClick={() => handleDeleteSlot(activeRoom.id, slot.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {activeRoom.slots?.length === 0 && <p className="col-span-2 text-xs text-muted-foreground italic text-center py-8">Aucun box ou cage dans ce local.</p>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="planning" className="space-y-8 animate-in fade-in duration-300">
                {/* Horaires */}
                <Card className="border-none shadow-none bg-accent/5">
                  <CardHeader className="pb-4 border-b border-border/50">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> Horaires d'ouverture
                    </CardTitle>
                    <CardDescription className="text-sm">Utilisés pour le moteur de réservation et les agendas.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                      {(Object.keys(DAYS_FR) as Array<keyof typeof DAYS_FR>).map(day => {
                        const slots = activeClinic.opening_hours?.[day] || []
                        return (
                          <div key={day} className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-background/50 group">
                            <p className="text-xs font-bold uppercase text-muted-foreground/70">{DAYS_FR[day]}</p>
                            <div className="space-y-1.5 min-h-[40px] flex flex-col justify-center">
                              {slots.map((s, idx) => (
                                <p key={idx} className="text-xs font-semibold text-center text-primary bg-primary/5 py-1 rounded">{s.open} — {s.close}</p>
                              ))}
                              {slots.length === 0 && <p className="text-xs text-muted-foreground/30 text-center uppercase font-bold py-1">Fermé</p>}
                            </div>
                            <button 
                              onClick={() => handleOpenHoursDialog(day)}
                              className="text-xs font-bold text-primary/60 hover:text-primary opacity-0 group-hover:opacity-100 transition-all pt-2 border-t border-border/20 mt-1"
                            >
                              Éditer
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Congés */}
                <Card className="border-none shadow-none bg-accent/5">
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" /> Congés & Fermetures
                      </CardTitle>
                      <CardDescription className="text-sm">Périodes exceptionnelles de fermeture du site.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setIsClosureDialogOpen(true)}>
                      <Plus className="h-3.5 w-3.5 mr-2" /> Programmer
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activeClinic.closures?.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-3 bg-background/50 border border-border rounded-xl transition-all hover:shadow-sm group">
                          <div className="flex flex-col gap-1 text-left">
                            <span className="text-sm font-semibold">{c.description}</span>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                              {format(new Date(c.start_date), "dd.MM.yyyy")} — {format(new Date(c.end_date), "dd.MM.yyyy")}
                            </span>
                          </div>
                          <button onClick={() => handleDeleteClosure(c.id)} className="p-1.5 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {activeClinic.closures?.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-xl space-y-2 opacity-50">
                          <CalendarIcon className="h-8 w-8 text-muted-foreground/20" />
                          <p className="text-sm text-muted-foreground">Aucune fermeture programmée.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl text-muted-foreground space-y-4 bg-accent/5">
              <div className="p-4 bg-background rounded-full shadow-sm border">
                <Building2 className="h-10 w-10 opacity-20 text-primary" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-primary/60 uppercase text-xs tracking-widest">Aucun site sélectionné</p>
                <p className="text-sm max-w-[250px]">Veuillez choisir une clinique dans la liste de gauche pour la configurer.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS (DIALOGS) --- */}

      {/* Team Management */}
      <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Gestion des accès</DialogTitle>
            <DialogDescription>Autorisez des membres de l'équipe à travailler sur ce site.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto pr-2">
            {allUsers.map(user => {
              const isAssigned = activeClinic?.staff?.some(u => u.id === user.id)
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
                    onClick={() => toggleStaffAssignment(user.id)}
                  >
                    {isAssigned ? <Check className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsStaffDialogOpen(false)} className="w-full sm:w-auto">Terminer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Room */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Ajouter un local</DialogTitle>
            <DialogDescription>Définissez l'usage de cette salle.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Nom de la salle</Label>
              <Input value={newRoomData.name} onChange={e => setNewRoomData({...newRoomData, name: e.target.value})} placeholder="ex: Consultation 1" className="font-medium" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Vocation</Label>
              <Select value={newRoomData.type} onValueChange={v => setNewRoomData({...newRoomData, type: v as RoomType})}>
                <SelectTrigger className="font-medium">
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

      {/* Add Slot */}
      <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-primary">Nouveau box/cage</DialogTitle>
            <DialogDescription>Unité d'accueil individuelle pour l'hospitalisation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Référence visuelle</Label>
              <Input value={newSlotData.box_reference} onChange={e => setNewSlotData({...newSlotData, box_reference: e.target.value})} placeholder="ex: Box A1" className="font-bold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Format d'unité</Label>
              <Select value={newSlotData.type} onValueChange={v => setNewSlotData({...newSlotData, type: v as SlotType})}>
                <SelectTrigger className="font-medium">
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
            <Button onClick={handleAddSlotSubmit}>Ajouter l'unité</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Hours */}
      <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Horaires : {editingDay ? DAYS_FR[editingDay as keyof typeof DAYS_FR] : ""}</DialogTitle>
            <DialogDescription>Gérez les plages d'ouverture pour ce site.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
            {editingSlots.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border">
                <div className="flex-1 grid gap-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Ouverture</Label>
                  <Input type="time" value={slot.open} onChange={e => {
                    const next = [...editingSlots]; next[idx].open = e.target.value; setEditingSlots(next);
                  }} className="font-bold bg-background" />
                </div>
                <div className="flex-1 grid gap-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Fermeture</Label>
                  <Input type="time" value={slot.close} onChange={e => {
                    const next = [...editingSlots]; next[idx].close = e.target.value; setEditingSlots(next);
                  }} className="font-bold bg-background" />
                </div>
                <Button variant="ghost" size="icon" className="mt-5 hover:text-destructive" onClick={() => setEditingSlots(editingSlots.filter((_, i) => i !== idx))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full border-dashed py-6 text-xs uppercase font-bold tracking-wider" onClick={() => setEditingSlots([...editingSlots, { open: "08:00", close: "12:00" }])}>
              <Plus className="h-4 w-4 mr-2" /> Ajouter une tranche
            </Button>
            {editingSlots.length === 0 && <p className="text-center text-xs text-muted-foreground italic py-4">Fermé toute la journée.</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsHoursDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveHours} className="font-bold">Valider les horaires</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Closure */}
      <Dialog open={isClosureDialogOpen} onOpenChange={setIsClosureDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-orange-600">Fermeture exceptionnelle</DialogTitle>
            <DialogDescription>Programmez une période de congés ou travaux.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Motif du congé</Label>
              <Input value={newClosureData.description} onChange={e => setNewClosureData({...newClosureData, description: e.target.value})} placeholder="ex: Vacances d'hiver" className="font-medium" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-9",
                        !newClosureData.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newClosureData.start_date ? format(newClosureData.start_date, "dd.MM.yyyy") : <span>Choisir...</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newClosureData.start_date}
                      onSelect={(date) => setNewClosureData({...newClosureData, start_date: date})}
                      locale={fr}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-9",
                        !newClosureData.end_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newClosureData.end_date ? format(newClosureData.end_date, "dd.MM.yyyy") : <span>Choisir...</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newClosureData.end_date}
                      onSelect={(date) => setNewClosureData({...newClosureData, end_date: date})}
                      locale={fr}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsClosureDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddClosureSubmit} className="font-bold">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Alert */}
      <AlertDialog open={alertConfig.open} onOpenChange={v => setAlertConfig({...alertConfig, open: v})}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2 text-left">
              <div className="p-2 bg-destructive/10 rounded-full text-destructive shadow-inner"><AlertTriangle className="h-6 w-6" /></div>
              <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm font-medium text-left">{alertConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 pt-4">
            <AlertDialogCancel asChild>
              <Button variant="ghost">Annuler</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                variant="destructive" 
                onClick={() => { alertConfig.action(); setAlertConfig({...alertConfig, open: false}); }}
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
