/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import api from "@/lib/api"
import type { Clinic, Setting } from "@/types/resource"

interface SettingsContextType {
  settings: Setting[]
  getSetting: (key: string) => string | number | boolean | Record<string, unknown> | Array<unknown>
  isLoading: boolean
  refreshSettings: () => Promise<void>
  activeClinic: Clinic | null
  setActiveClinic: (clinic: Clinic | null) => void
  clinics: Clinic[]
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Setting[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [activeClinic, setActiveClinicState] = useState<Clinic | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchInitialData = useCallback(async () => {
    try {
      const [settingsRes, clinicsRes] = await Promise.all([
        api.get("/settings/"),
        api.get("/resources/clinics")
      ])
      setSettings(settingsRes.data)
      setClinics(clinicsRes.data)
      
      const storedClinicId = localStorage.getItem("activeClinicId")
      if (storedClinicId) {
        const found = clinicsRes.data.find((c: Clinic) => c.id === parseInt(storedClinicId))
        if (found) {
          setActiveClinicState(found)
        } else if (clinicsRes.data.length > 0) {
          const first = clinicsRes.data[0]
          setActiveClinicState(first)
          localStorage.setItem("activeClinicId", first.id.toString())
        }
      } else if (clinicsRes.data.length > 0) {
        const first = clinicsRes.data[0]
        setActiveClinicState(first)
        localStorage.setItem("activeClinicId", first.id.toString())
      }
    } catch (error) {
      console.error("Failed to load initial settings/clinics", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  const setActiveClinic = useCallback((clinic: Clinic | null) => {
    setActiveClinicState(clinic)
    if (clinic) localStorage.setItem("activeClinicId", clinic.id.toString())
    else localStorage.removeItem("activeClinicId")
  }, [])

  const getSetting = useCallback((key: string) => {
    const setting = settings.find(s => s.key === key)
    return setting ? setting.value : ""
  }, [settings])

  useEffect(() => {
    const companyName = getSetting("company_name")
    document.title = companyName && typeof companyName === 'string' 
      ? `${companyName} | VetOS` 
      : "VetOS - Practice Management"
  }, [getSetting])

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
