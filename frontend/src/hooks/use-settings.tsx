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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Setting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings/")
      setSettings(response.data)
    } catch (error) {
      console.error("Failed to load global settings", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    const practiceName = getSetting("practice_name")
    document.title = practiceName ? `${practiceName} | VetOS` : "VetOS - Practice Management"
  }, [settings])

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.key === key)
    return setting ? setting.value : ""
  }

  return (
    <SettingsContext.Provider value={{ settings, getSetting, isLoading, refreshSettings: fetchSettings }}>
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
