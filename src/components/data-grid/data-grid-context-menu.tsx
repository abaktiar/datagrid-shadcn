import { ReactNode } from 'react'
import { 
  Copy, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpDown,
  Filter,
  Pin,
  PinOff,
  MoreHorizontal
} from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Row, Column } from '@tanstack/react-table'

interface CellContextMenuProps<TData> {
  children: ReactNode
  row: Row<TData>
  column: Column<TData>
  value: any
  onCopy?: (value: any) => void
  onEdit?: (row: Row<TData>) => void
  onDelete?: (row: Row<TData>) => void
  onView?: (row: Row<TData>) => void
  customActions?: Array<{
    id: string
    label: string
    icon?: ReactNode
    onClick: (row: Row<TData>, column: Column<TData>, value: any) => void
    separator?: boolean
  }>
}

export function CellContextMenu<TData>({
  children,
  row,
  column,
  value,
  onCopy,
  onEdit,
  onDelete,
  onView,
  customActions = []
}: CellContextMenuProps<TData>) {
  const handleCopy = () => {
    if (onCopy) {
      onCopy(value)
    } else {
      // Default copy behavior
      const textValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
      navigator.clipboard.writeText(textValue)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleCopy} className="flex items-center space-x-2">
          <Copy className="h-4 w-4" />
          <span>Copy Cell</span>
        </ContextMenuItem>
        
        {onView && (
          <ContextMenuItem onClick={() => onView(row)} className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </ContextMenuItem>
        )}
        
        {onEdit && (
          <ContextMenuItem onClick={() => onEdit(row)} className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit Row</span>
          </ContextMenuItem>
        )}
        
        {(onView || onEdit) && <ContextMenuSeparator />}
        
        {/* Row Actions */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center space-x-2">
            <MoreHorizontal className="h-4 w-4" />
            <span>Row Actions</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem 
              onClick={() => row.toggleSelected()}
              className="flex items-center space-x-2"
            >
              <span>{row.getIsSelected() ? 'Deselect' : 'Select'} Row</span>
            </ContextMenuItem>
            <ContextMenuItem 
              onClick={() => {
                // Copy entire row data
                navigator.clipboard.writeText(JSON.stringify(row.original, null, 2))
              }}
              className="flex items-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Row Data</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        {/* Custom Actions */}
        {customActions.length > 0 && (
          <>
            <ContextMenuSeparator />
            {customActions.map((action) => (
              <div key={action.id}>
                {action.separator && <ContextMenuSeparator />}
                <ContextMenuItem 
                  onClick={() => action.onClick(row, column, value)}
                  className="flex items-center space-x-2"
                >
                  {action.icon && <span className="h-4 w-4">{action.icon}</span>}
                  <span>{action.label}</span>
                </ContextMenuItem>
              </div>
            ))}
          </>
        )}
        
        {onDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={() => onDelete(row)} 
              className="flex items-center space-x-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Row</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

interface HeaderContextMenuProps<TData> {
  children: ReactNode
  column: Column<TData>
  onSort?: (direction: 'asc' | 'desc' | false) => void
  onFilter?: () => void
  onHide?: () => void
  onPin?: (direction: 'left' | 'right' | false) => void
  customActions?: Array<{
    id: string
    label: string
    icon?: ReactNode
    onClick: (column: Column<TData>) => void
    separator?: boolean
  }>
}

export function HeaderContextMenu<TData>({
  children,
  column,
  onSort,
  onFilter,
  onHide,
  onPin,
  customActions = []
}: HeaderContextMenuProps<TData>) {
  const sortDirection = column.getIsSorted()
  const canSort = column.getCanSort()
  const canFilter = column.getCanFilter()
  const canHide = column.getCanHide()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {/* Sorting */}
        {canSort && (
          <ContextMenuSub>
            <ContextMenuSubTrigger className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem 
                onClick={() => {
                  column.toggleSorting(false)
                  onSort?.('asc')
                }}
                className="flex items-center space-x-2"
              >
                <ArrowUp className="h-4 w-4" />
                <span>Sort Ascending</span>
              </ContextMenuItem>
              <ContextMenuItem 
                onClick={() => {
                  column.toggleSorting(true)
                  onSort?.('desc')
                }}
                className="flex items-center space-x-2"
              >
                <ArrowDown className="h-4 w-4" />
                <span>Sort Descending</span>
              </ContextMenuItem>
              {sortDirection && (
                <ContextMenuItem 
                  onClick={() => {
                    column.clearSorting()
                    onSort?.(false)
                  }}
                  className="flex items-center space-x-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Clear Sort</span>
                </ContextMenuItem>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}
        
        {/* Filtering */}
        {canFilter && (
          <ContextMenuItem 
            onClick={() => {
              onFilter?.()
              // You could implement a filter dialog here
            }}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter Column</span>
          </ContextMenuItem>
        )}
        
        {(canSort || canFilter) && <ContextMenuSeparator />}
        
        {/* Column Visibility */}
        {canHide && (
          <ContextMenuItem 
            onClick={() => {
              column.toggleVisibility()
              onHide?.()
            }}
            className="flex items-center space-x-2"
          >
            {column.getIsVisible() ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Hide Column</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Show Column</span>
              </>
            )}
          </ContextMenuItem>
        )}
        
        {/* Column Pinning */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center space-x-2">
            <Pin className="h-4 w-4" />
            <span>Pin Column</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem 
              onClick={() => {
                column.pin('left')
                onPin?.('left')
              }}
              className="flex items-center space-x-2"
            >
              <Pin className="h-4 w-4" />
              <span>Pin Left</span>
            </ContextMenuItem>
            <ContextMenuItem 
              onClick={() => {
                column.pin('right')
                onPin?.('right')
              }}
              className="flex items-center space-x-2"
            >
              <Pin className="h-4 w-4" />
              <span>Pin Right</span>
            </ContextMenuItem>
            <ContextMenuItem 
              onClick={() => {
                column.pin(false)
                onPin?.(false)
              }}
              className="flex items-center space-x-2"
            >
              <PinOff className="h-4 w-4" />
              <span>Unpin</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        {/* Custom Actions */}
        {customActions.length > 0 && (
          <>
            <ContextMenuSeparator />
            {customActions.map((action) => (
              <div key={action.id}>
                {action.separator && <ContextMenuSeparator />}
                <ContextMenuItem 
                  onClick={() => action.onClick(column)}
                  className="flex items-center space-x-2"
                >
                  {action.icon && <span className="h-4 w-4">{action.icon}</span>}
                  <span>{action.label}</span>
                </ContextMenuItem>
              </div>
            ))}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
