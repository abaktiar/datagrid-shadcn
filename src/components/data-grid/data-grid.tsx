import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataGridProps, DataGridContextValue } from './types'
import { DataGridContext } from './context'
import { DataGridHeader } from './data-grid-header'
import { DataGridBody } from './data-grid-body'
import { DataGridPagination } from './data-grid-pagination'
import { DataGridActionDock } from './data-grid-action-dock'
import { DataGridFilters } from './data-grid-filters'

export function DataGrid<TData>({
  data,
  columns,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  onRowSelectionChange,
  actions = [],
  enablePagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  manualPagination = false,
  pageCount,
  onPaginationChange,
  enableSorting = true,
  enableMultiSort = false,
  manualSorting = false,
  onSortingChange,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  manualFiltering = false,
  onGlobalFilterChange,
  onColumnFiltersChange,
  enableColumnResizing = true,
  onColumnSizingChange,
  enableVirtualization = false,
  estimateSize = 35,
  isLoading = false,
  error = null,
  className,
  'aria-label': ariaLabel = 'Data grid',
  'aria-describedby': ariaDescribedBy,
}: DataGridProps<TData>) {
  // State management
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // Enhanced columns with selection column if needed
  const enhancedColumns = useMemo(() => {
    const cols = [...columns];

    if (enableRowSelection) {
      cols.unshift({
        id: 'select',
        header: ({ table }) => (
          <input
            type='checkbox'
            checked={table.getIsAllPageRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomePageRowsSelected();
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label='Select all rows'
            className='rounded border-input'
          />
        ),
        cell: ({ row }) => (
          <input
            type='checkbox'
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label={`Select row ${row.index + 1}`}
            className='rounded border-input'
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      });
    }

    return cols;
  }, [columns, enableRowSelection]);

  // Table instance
  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
      columnSizing,
      globalFilter,
      pagination,
    },
    enableRowSelection,
    enableMultiRowSelection,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableGlobalFilter || enableColumnFilters ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount: pageCount ?? -1,
    getRowId: (row, index) => {
      // Use a unique identifier if available, otherwise fall back to index
      return (row as any).id?.toString() ?? index.toString();
    },
  });

  // Selected rows
  const selectedRows = useMemo(() => {
    return table.getFilteredSelectedRowModel().rows;
  }, [table, rowSelection]);

  // Context value
  const contextValue: DataGridContextValue<TData> = useMemo(
    () => ({
      table,
      selectedRows,
      actions,
      isLoading,
      error,
    }),
    [table, selectedRows, actions, isLoading, error]
  );

  // Handle external callbacks
  React.useEffect(() => {
    onRowSelectionChange?.(selectedRows);
  }, [selectedRows, onRowSelectionChange]);

  React.useEffect(() => {
    onSortingChange?.(sorting);
  }, [sorting, onSortingChange]);

  React.useEffect(() => {
    onColumnFiltersChange?.(columnFilters);
  }, [columnFilters, onColumnFiltersChange]);

  React.useEffect(() => {
    onGlobalFilterChange?.(globalFilter);
  }, [globalFilter, onGlobalFilterChange]);

  React.useEffect(() => {
    onPaginationChange?.(pagination.pageIndex, pagination.pageSize);
  }, [pagination, onPaginationChange]);

  React.useEffect(() => {
    onColumnSizingChange?.(columnSizing);
  }, [columnSizing, onColumnSizingChange]);

  return (
    <DataGridContext.Provider value={contextValue}>
      <div
        className={cn('space-y-4', className)}
        role='region'
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}>
        {/* Global Filter and Column Visibility */}
        {(enableGlobalFilter || enableColumnFilters) && (
          <DataGridFilters
            enableGlobalFilter={enableGlobalFilter}
            enableColumnFilters={enableColumnFilters}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
          />
        )}

        {/* Table */}
        <div className='rounded-md border'>
          <div className='relative overflow-auto'>
            <table
              className='w-full caption-bottom text-sm'
              role='grid'
              aria-rowcount={table.getRowModel().rows.length}
              style={{
                width: table.getCenterTotalSize(),
              }}>
              <DataGridHeader />
              <DataGridBody enableVirtualization={enableVirtualization} estimateSize={estimateSize} />
            </table>
          </div>
        </div>

        {/* Pagination and Action Dock Container */}
        <div className='relative'>
          {/* Pagination */}
          {enablePagination && <DataGridPagination pageSizeOptions={pageSizeOptions} />}

          {/* Action Dock - positioned near pagination */}
          {enableRowSelection && selectedRows.length > 0 && actions.length > 0 && <DataGridActionDock />}
        </div>
      </div>
    </DataGridContext.Provider>
  );
}
