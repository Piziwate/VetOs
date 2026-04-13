import * as React from "react"
import { Link } from "react-router-dom"
import type {
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, UserPlus } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"
import { DataTable } from "@/components/ui/data-table"

interface Client {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  city: string
  is_active: boolean
  legacy_id: string
}

export function Clients() {
  const { t } = useTranslation()
  const [data, setData] = React.useState<Client[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  
  // Table State
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "last_name", desc: false }])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = React.useState("")

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter)
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, 500)
    return () => clearTimeout(timer)
  }, [globalFilter])

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const sortBy = sorting.length > 0 ? sorting[0].id : "last_name"
      const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "asc"
      
      const response = await api.get("/clients/", {
        params: {
          skip: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          search: debouncedSearch || undefined,
          sort_by: sortBy,
          sort_order: sortOrder,
        }
      })
      
      if (response.data && Array.isArray(response.data.items)) {
        setData(response.data.items)
        setTotalCount(response.data.total)
      } else {
        setData([])
      }
    } catch (error) {
      console.error("Failed to fetch clients", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, sorting])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "legacy_id",
      header: t("clients.columns.legacy_id"),
      cell: ({ row }) => <div className="font-mono text-xs text-muted-foreground">{row.getValue("legacy_id")}</div>,
    },
    {
      accessorKey: "last_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 h-8"
          >
            {t("clients.columns.last_name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("last_name")}</div>,
    },
    {
      accessorKey: "first_name",
      header: t("clients.columns.first_name"),
    },
    {
      accessorKey: "email",
      header: t("clients.columns.email"),
      cell: ({ row }) => row.getValue("email") || "-",
    },
    {
      accessorKey: "phone",
      header: t("clients.columns.phone"),
      cell: ({ row }) => row.getValue("phone") || "-",
    },
    {
      accessorKey: "city",
      header: t("clients.columns.city"),
    },
    {
      accessorKey: "is_active",
      header: t("clients.columns.status"),
      cell: ({ row }) => (
        <Badge variant={row.getValue("is_active") ? "default" : "secondary"}>
          {row.getValue("is_active") ? t("clients.columns.active") : t("clients.columns.inactive")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: t("clients.actions.title"),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("clients.actions.title")}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.legacy_id)}>
                {t("clients.actions.copy_id")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/clients/${row.original.id}`}>{t("clients.actions.view_profile")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>{t("clients.actions.view_patients")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("clients.title")}</h2>
          <p className="text-muted-foreground">
            {t("clients.found_count", { count: totalCount })}
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t("clients.new_client")}
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
    </div>
  )
}
