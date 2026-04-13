import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

interface ClientDetailsTabProps {
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
}

export const ClientDetailsTab = ({ email, phone, address, city }: ClientDetailsTabProps) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("client_detail.contact_info")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("client_detail.email")}</p>
              <p className="font-medium">{email || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("client_detail.phone")}</p>
              <p className="font-medium">{phone || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("client_detail.address")}</p>
              <p className="font-medium">{address ? `${address}, ${city || ""}` : city || "-"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
