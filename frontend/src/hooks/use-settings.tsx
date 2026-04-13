import React, { createContext, useContext, useState, useEffect } from "react"
import api from "@/lib/api"

interface Setting {
  key: string
  value: any
  category: string
  sub_category: string
  description: string
}

interface SettingsContextType {
  settings: Setting[]
  getSetting: (key: string) => any
  isLoading: boolean
  refreshSettings: () => Promise<void>
  activeClinic: any
  setActiveClinic: (clinic: any) => void
  clinics: any[]
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Setting[]>([])
  const [clinics, setClinics] = useState<any[]>([])
  const [activeClinic, setActiveClinicState] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchInitialData = async () => {
    try {
      const [settingsRes, clinicsRes] = await Promise.all([
        api.get("/settings/"),
        api.get("/resources/clinics")
      ])
      setSettings(settingsRes.data)
      setClinics(clinicsRes.data)
      
      // Load active clinic from localStorage or take the first one
      const storedClinicId = localStorage.getItem("activeClinicId")
      if (storedClinicId) {
        const found = clinicsRes.data.find((c: any) => c.id === parseInt(storedClinicId))
        if (found) setActiveClinicState(found)
        else if (clinicsRes.data.length > 0) setActiveClinic(clinicsRes.data[0])
      } else if (clinicsRes.data.length > 0) {
        setActiveClinic(clinicsRes.data[0])
      }
    } catch (error) {
      console.error("Failed to load initial settings/clinics", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  const setActiveClinic = (clinic: any) => {
    setActiveClinicState(clinic)
    if (clinic) localStorage.setItem("activeClinicId", clinic.id.toString())
    else localStorage.removeItem("activeClinicId")
  }

  useEffect(() => {
    const companyName = getSetting("company_name")
    document.title = companyName ? `${companyName} | VetOS` : "VetOS - Practice Management"
  }, [settings])

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.key === key)
    return setting ? setting.value : ""
  }

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      getSetting, 
      isLoading, 
      refreshSettings: fetchInitialData,
      activeClinic,
      setActiveClinic,
      clinics
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
