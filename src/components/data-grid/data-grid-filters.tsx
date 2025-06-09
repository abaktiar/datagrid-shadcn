import { Search, Settings2, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useDataGrid } from './context'

interface DataGridFiltersProps {
  enableGlobalFilter?: boolean
  enableColumnFilters?: boolean
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

export function DataGridFilters({
  enableGlobalFilter = true,
  enableColumnFilters = true,
  globalFilter,
  onGlobalFilterChange,
}: DataGridFiltersProps) {
  const { table } = useDataGrid()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Global Search */}
        {enableGlobalFilter && (
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(event) => onGlobalFilterChange(event.target.value)}
              className="pl-8"
              aria-label="Search all columns"
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Column Visibility Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto hidden h-8 lg:flex"
              aria-label="Toggle column visibility"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== 'undefined' && column.getCanHide()
              )
              .map((column) => {
                const isVisible = column.getIsVisible()
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={isVisible}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    <div className="flex items-center space-x-2">
                      {isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      <span>
                        {typeof column.columnDef.header === 'string'
                          ? column.columnDef.header
                          : column.id}
                      </span>
                    </div>
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
