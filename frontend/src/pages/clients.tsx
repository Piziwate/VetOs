import * as React from "react"
import { Link } from "react-router-dom"
import type {
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Search, UserPlus } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"

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
      setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page on search
    }, 500)
    return () => clearTimeout(timer)
  }, [globalFilter])

  // Fetch data from API
  const fetchData = React.useCallback(async () => {
    setLoading(true)
    console.log("Fetching clients with params:", {
      skip: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      search: debouncedSearch,
      sorting
    })
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
      
      console.log("API Response received:", response.data)
      
      if (response.data && Array.isArray(response.data.items)) {
        setData(response.data.items)
        setTotalCount(response.data.total)
        console.log(`Successfully set ${response.data.items.length} items. Total: ${response.data.total}`)
      } else {
        console.error("API response format invalid or items missing:", response.data)
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
      header: "ID Diana",
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
            Nom
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("last_name")}</div>,
    },
    {
      accessorKey: "first_name",
      header: "Prénom",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email") || "-",
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
      cell: ({ row }) => row.getValue("phone") || "-",
    },
    {
      accessorKey: "city",
      header: "Ville",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("is_active") ? "default" : "secondary"}>
          {row.getValue("is_active") ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    {
      id: "actions",
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.legacy_id)}>
                Copier l'ID Diana
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/clients/${row.original.id}`}>Voir la fiche client</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Voir les patients</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
  })

  // Log table state after it's defined
  console.log("Current table state:", { 
    dataLength: data.length, 
    totalCount, 
    loading, 
    rowsInModel: table.getRowModel().rows.length 
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("menu.clients")}</h2>
          <p className="text-muted-foreground">
            {totalCount} clients trouvés dans la base de données.
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Nouveau Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Recherche globale (nom, tel, ville...)"
                className="pl-8"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground whitespace-nowrap">Lignes par page</span>
               <select
                value={pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value))
                }}
                className="h-8 w-16 rounded-md border border-input bg-background px-1 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {[10, 20, 30, 50, 100].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
               </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Chargement en cours...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Aucun résultat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Page {pagination.pageIndex + 1} sur {table.getPageCount() || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || loading}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
