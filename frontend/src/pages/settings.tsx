import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import api from "@/lib/api"

interface Setting {
  key: string
  value: any
  category: string
  sub_category: string
  description: string
}

export const Settings = () => {
  const [settings, setSettings] = useState<Setting[]>([])
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({})
  const [activeCategory, setActiveCategory] = useState<string>("operational")
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings/")
      setSettings(response.data)
    } catch (error) {
      console.error("Failed to fetch settings", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (key: string, value: any) => {
    setPendingChanges(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = Object.entries(pendingChanges).map(([key, value]) => 
        api.put("/settings/", { key, value })
      )
      await Promise.all(updates)
      
      setSettings(prev => prev.map(s => 
        pendingChanges[s.key] !== undefined ? { ...s, value: pendingChanges[s.key] } : s
      ))
      setPendingChanges({})
      alert("Paramètres enregistrés avec succès !")
    } catch (error) {
      console.error("Failed to save settings", error)
      alert("Erreur lors de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  const filteredSettings = settings.filter(s => s.category === activeCategory)
  
  // Group by sub_category
  const groupedSettings = filteredSettings.reduce((acc, setting) => {
    const subCat = setting.sub_category || "Général"
    if (!acc[subCat]) acc[subCat] = []
    acc[subCat].push(setting)
    return acc
  }, {} as Record<string, Setting[]>)

  const subCategories = Object.keys(groupedSettings)

  const hasChanges = Object.keys(pendingChanges).some(key => 
    settings.find(s => s.key === key)?.category === activeCategory
  )

  if (loading) return <div>Chargement des paramètres...</div>

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Gérez la configuration de votre cabinet et les paramètres techniques.</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        )}
      </div>

      <div className="flex gap-12">
        {/* VS Code Style Sidebar with Hierarchy */}
        <div className="w-56 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => {
                setActiveCategory("operational")
                setActiveSubCategory(null)
              }}
              className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${activeCategory === "operational" ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"}`}
            >
              Opérationnel
            </button>
            {activeCategory === "operational" && (
              <div className="ml-4 flex flex-col gap-1 border-l pl-2">
                {subCategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={`text-left px-2 py-1 rounded-md text-xs transition-colors ${activeSubCategory === sub ? "text-primary font-medium bg-primary/5" : "text-muted-foreground hover:text-accent-foreground hover:bg-accent/30"}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <button 
              onClick={() => {
                setActiveCategory("technical")
                setActiveSubCategory(null)
              }}
              className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${activeCategory === "technical" ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"}`}
            >
              Technique
            </button>
            {activeCategory === "technical" && (
              <div className="ml-4 flex flex-col gap-1 border-l pl-2">
                {subCategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={`text-left px-2 py-1 rounded-md text-xs transition-colors ${activeSubCategory === sub ? "text-primary font-medium bg-primary/5" : "text-muted-foreground hover:text-accent-foreground hover:bg-accent/30"}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-10">
          {Object.entries(groupedSettings)
            .filter(([subCat]) => !activeSubCategory || subCat === activeSubCategory)
            .map(([subCat, settingsInSubCat]) => (
              <div key={subCat} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-lg font-semibold">{subCat}</h2>
                  <Separator className="mt-2" />
                </div>
                
                <div className="flex flex-col gap-6">
                  {settingsInSubCat.map(setting => (
                    <div key={setting.key} className="grid gap-2">
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Label>
                      <div className="flex gap-4">
                        <Input 
                          id={setting.key}
                          value={pendingChanges[setting.key] !== undefined ? pendingChanges[setting.key] : setting.value}
                          onChange={(e) => handleFieldChange(setting.key, e.target.value)}
                          className="max-w-md"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          
          {hasChanges && (
            <div className="pt-4 border-t">
              <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          )}

          {filteredSettings.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Aucun paramètre trouvé dans cette catégorie.</p>
          )}
        </div>
      </div>
    </div>
  )
}
