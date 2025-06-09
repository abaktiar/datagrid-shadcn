import { ColumnDef, Row, Table } from '@tanstack/react-table'
import { ReactNode } from 'react'

export interface DataGridColumn<TData> extends ColumnDef<TData> {
  id: string
  header: string | ReactNode
  accessorKey?: keyof TData
  cell?: ({ row }: { row: Row<TData> }) => ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
  enableHiding?: boolean
  enableResizing?: boolean
  size?: number
  minSize?: number
  maxSize?: number
}

export interface DataGridAction<TData> {
  id: string
  label: string
  icon?: ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  onClick: (selectedRows: Row<TData>[]) => void | Promise<void>
  isEnabled?: (selectedRows: Row<TData>[]) => boolean
  isVisible?: (selectedRows: Row<TData>[]) => boolean
}

export interface DataGridProps<TData> {
  data: TData[];
  columns: DataGridColumn<TData>[];

  // Selection
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: Row<TData>[]) => void;

  // Actions
  actions?: DataGridAction<TData>[];

  // Pagination
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  manualPagination?: boolean;
  pageCount?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;

  // Sorting
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  manualSorting?: boolean;
  onSortingChange?: (sorting: any[]) => void;

  // Filtering
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  manualFiltering?: boolean;
  onGlobalFilterChange?: (globalFilter: string) => void;
  onColumnFiltersChange?: (columnFilters: any[]) => void;

  // Column resizing
  enableColumnResizing?: boolean;
  onColumnSizingChange?: (columnSizing: Record<string, number>) => void;

  // Virtualization
  enableVirtualization?: boolean;
  estimateSize?: number;

  // Loading & Error states
  isLoading?: boolean;
  error?: string | null;

  // Styling
  className?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export interface DataGridState {
  rowSelection: Record<string, boolean>
  sorting: any[]
  columnFilters: any[]
  globalFilter: string
  pagination: {
    pageIndex: number
    pageSize: number
  }
  columnVisibility: Record<string, boolean>
  columnSizing: Record<string, number>
}

export interface DataGridContextValue<TData> {
  table: Table<TData>
  selectedRows: Row<TData>[]
  actions: DataGridAction<TData>[]
  isLoading: boolean
  error: string | null
}
