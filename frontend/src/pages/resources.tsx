import { useEffect, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Plus, Building2, LayoutGrid, Timer } from "lucide-react"
import api from "@/lib/api"
import type { Clinic, RoomType, SlotType, OpeningHoursSlot, StaffMember } from "@/types/resource"
import { format } from "date-fns"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Sub-components
import { ClinicSidebar } from "@/components/resources/clinic-sidebar"
import { GeneralTab } from "@/components/resources/general-tab"
import { InfrastructureTab } from "@/components/resources/infrastructure-tab"
import { PlanningTab } from "@/components/resources/planning-tab"
import { StaffDialog } from "@/components/resources/dialogs/StaffDialog"
import { RoomDialog } from "@/components/resources/dialogs/RoomDialog"
import { SlotDialog } from "@/components/resources/dialogs/SlotDialog"
import { HoursDialog } from "@/components/resources/dialogs/HoursDialog"
import { ClosureDialog } from "@/components/resources/dialogs/ClosureDialog"
import { ConfirmDialog } from "@/components/resources/dialogs/ConfirmDialog"

export const Resources = () => {
  const { t } = useTranslation()
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
  }, [])

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

  const handleUpdateClinicField = async (field: keyof Clinic, value: Clinic[keyof Clinic]) => {
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

  const handleDeleteClinic = () => {
    if (!activeClinic) return
    setAlertConfig({
      open: true,
      title: t("resources.general.delete_site"),
      description: t("resources.general.delete_site_desc"),
      action: async () => {
        await api.delete(`/resources/clinics/${activeClinic.id}`)
        fetchClinics()
        setActiveClinic(null)
      }
    })
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
      title: "Supprimer la salle ?", // TODO: Add to translations if needed
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

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-muted-foreground italic">Chargement des ressources...</div>

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{t("resources.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("resources.description")}</p>
        </div>
        <Button onClick={handleCreateClinic} size="sm">
          <Plus className="mr-2 h-4 w-4" /> {t("resources.add_site")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <ClinicSidebar 
          clinics={clinics}
          activeClinicId={activeClinic?.id}
          onSelectClinic={(c) => { setActiveClinic(c); setActiveRoomId(null); }}
        />

        <div className="space-y-6">
          {activeClinic ? (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> {t("resources.tabs.general")}
                </TabsTrigger>
                <TabsTrigger value="infrastructure" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" /> {t("resources.tabs.infrastructure")}
                </TabsTrigger>
                <TabsTrigger value="planning" className="flex items-center gap-2">
                  <Timer className="h-4 w-4" /> {t("resources.tabs.planning")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <GeneralTab 
                  activeClinic={activeClinic}
                  onUpdateField={handleUpdateClinicField}
                  onDeleteClinic={handleDeleteClinic}
                  onManageStaff={() => setIsStaffDialogOpen(true)}
                />
              </TabsContent>

              <TabsContent value="infrastructure">
                <InfrastructureTab 
                  activeClinic={activeClinic}
                  activeRoomId={activeRoomId}
                  onSetActiveRoomId={setActiveRoomId}
                  onAddRoom={() => setIsRoomDialogOpen(true)}
                  onUpdateRoomType={handleUpdateRoomType}
                  onDeleteRoom={handleDeleteRoom}
                  onAddSlot={() => setIsSlotDialogOpen(true)}
                  onDeleteSlot={handleDeleteSlot}
                />
              </TabsContent>

              <TabsContent value="planning">
                <PlanningTab 
                  activeClinic={activeClinic}
                  onEditHours={handleOpenHoursDialog}
                  onAddClosure={() => setIsClosureDialogOpen(true)}
                  onDeleteClosure={handleDeleteClosure}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl text-muted-foreground space-y-4 bg-accent/5">
              <div className="p-4 bg-background rounded-full shadow-sm border">
                <Building2 className="h-10 w-10 opacity-20 text-primary" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-primary/60 uppercase text-xs tracking-widest">
                  {t("resources.sites_group")}
                </p>
                <p className="text-sm max-w-[250px]">
                  Veuillez choisir une clinique dans la liste de gauche pour la configurer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <StaffDialog 
        open={isStaffDialogOpen}
        onOpenChange={setIsStaffDialogOpen}
        allUsers={allUsers}
        assignedStaff={activeClinic?.staff || []}
        onToggleStaff={toggleStaffAssignment}
      />

      <RoomDialog 
        open={isRoomDialogOpen}
        onOpenChange={setIsRoomDialogOpen}
        data={newRoomData}
        onChange={setNewRoomData}
        onSubmit={handleAddRoomSubmit}
      />

      <SlotDialog 
        open={isSlotDialogOpen}
        onOpenChange={setIsSlotDialogOpen}
        data={newSlotData}
        onChange={setNewSlotData}
        onSubmit={handleAddSlotSubmit}
      />

      <HoursDialog 
        open={isHoursDialogOpen}
        onOpenChange={setIsHoursDialogOpen}
        day={editingDay}
        slots={editingSlots}
        onSlotsChange={setEditingSlots}
        onSave={handleSaveHours}
      />

      <ClosureDialog 
        open={isClosureDialogOpen}
        onOpenChange={setIsClosureDialogOpen}
        data={newClosureData}
        onChange={setNewClosureData}
        onSubmit={handleAddClosureSubmit}
      />

      <ConfirmDialog 
        open={alertConfig.open}
        onOpenChange={(v) => setAlertConfig({...alertConfig, open: v})}
        title={alertConfig.title}
        description={alertConfig.description}
        onConfirm={() => { alertConfig.action(); setAlertConfig({...alertConfig, open: false}); }}
      />
    </div>
  )
}
