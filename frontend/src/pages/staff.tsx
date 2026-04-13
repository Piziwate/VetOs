import * as React from "react"
import { useTranslation } from "react-i18next"
import type { ColumnDef, SortingState, PaginationState } from "@tanstack/react-table"
import { ArrowUpDown, UserPlus, Shield, User, MoreHorizontal, Trash2, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from "@/lib/api"
import { DataTable } from "@/components/ui/data-table"
import { StaffDialog, type StaffFormData } from "@/components/staff/StaffDialog"
import { ConfirmDialog } from "@/components/resources/dialogs/ConfirmDialog"

interface StaffMember {
  id: number
  first_name: string
  last_name: string
  role: string
  specialty: string | null
  phone: string | null
  is_active: boolean
  user_id: number | null
  legacy_id: string | null
}

export function Staff() {
  const { t } = useTranslation()
  const [data, setData] = React.useState<StaffMember[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  
  // Modals state
  const [isDialogOpen, setIsStaffDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedStaff, setSelectedStaff] = React.useState<StaffMember | null>(null)
  const [formData, setFormData] = React.useState<StaffFormData>({
    first_name: "",
    last_name: "",
    role: "assistant",
    specialty: "",
    phone: "",
    legacy_id: ""
  })

  const [sorting, setSorting] = React.useState<SortingState>([{ id: "last_name", desc: false }])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get("/staff/")
      if (Array.isArray(response.data)) {
        setData(response.data)
        setTotalCount(response.data.length)
      }
    } catch (error) {
      console.error("Failed to fetch staff", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async () => {
    try {
      await api.post("/staff/", formData)
      setIsStaffDialogOpen(false)
      fetchData()
      // On pourrait ajouter un toast de succès ici
    } catch (error) {
      console.error("Failed to create staff", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedStaff) return
    try {
      await api.delete(`/staff/${selectedStaff.id}`)
      setIsDeleteOpen(false)
      fetchData()
    } catch (error) {
      console.error("Failed to delete staff", error)
    }
  }

  const openCreateDialog = () => {
    setFormData({
      first_name: "",
      last_name: "",
      role: "assistant",
      specialty: "",
      phone: "",
      legacy_id: ""
    })
    setSelectedStaff(null)
    setIsStaffDialogOpen(true)
  }

  const columns: ColumnDef<StaffMember>[] = [
    {
      accessorKey: "last_name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 h-8">
          {t("staff.columns.name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: t("staff.columns.role"),
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return <Badge variant="outline">{t(`staff.roles.${role}`)}</Badge>
      }
    },
    {
      accessorKey: "specialty",
      header: t("staff.columns.specialty"),
      cell: ({ row }) => row.getValue("specialty") || "-",
    },
    {
      accessorKey: "user_id",
      header: t("staff.columns.user_account"),
      cell: ({ row }) => (
        row.getValue("user_id") ? (
          <div className="flex items-center gap-2 text-primary font-medium text-xs">
            <Shield className="h-3 w-3" /> {t("staff.status.active")}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
            <User className="h-3 w-3" /> {t("staff.status.inactive")}
          </div>
        )
      )
    },
    {
      accessorKey: "legacy_id",
      header: t("staff.columns.legacy_id"),
      cell: ({ row }) => <code className="text-[10px] bg-muted px-1 rounded">{row.getValue("legacy_id") || "-"}</code>,
    },
    {
      accessorKey: "is_active",
      header: t("staff.columns.status"),
      cell: ({ row }) => (
        <Badge variant={row.getValue("is_active") ? "default" : "secondary"}>
          {row.getValue("is_active") ? t("staff.status.active") : t("staff.status.inactive")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const staff = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("clients.actions.title")}</DropdownMenuLabel>
              <DropdownMenuItem className="gap-2">
                <Pencil className="h-3.5 w-3.5" /> {t("resources.planning.edit")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 text-destructive focus:text-destructive"
                onClick={() => {
                  setSelectedStaff(staff)
                  setIsDeleteOpen(true)
                }}
              >
                <Trash2 className="h-3.5 w-3.5" /> {t("resources.infrastructure.technical_rooms") === "Locaux techniques" ? "Supprimer" : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("staff.title")}</h2>
          <p className="text-muted-foreground">
            {t("staff.found_count", { count: totalCount })}
          </p>
        </div>
        <Button className="gap-2" onClick={openCreateDialog}>
          <UserPlus className="h-4 w-4" />
          {t("staff.new_member")}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable 
            columns={columns}
            data={data}
            totalCount={totalCount}
            loading={loading}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={setSorting}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
          />
        </CardContent>
      </Card>

      <StaffDialog 
        open={isDialogOpen}
        onOpenChange={setIsStaffDialogOpen}
        data={formData}
        onChange={setFormData}
        onSubmit={handleCreate}
      />

      <ConfirmDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteOpen}
        title={t("staff.dialogs.delete_title")}
        description={t("staff.dialogs.delete_confirm")}
        onConfirm={handleDelete}
      />
    </div>
  )
}
