'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  Table,
  Row,
} from '@tanstack/react-table';
import { cn } from '../../lib/utils';
import { Checkbox } from '../ui/checkbox';
import { DataGridProps, DataGridContextValue } from './types';
import { DataGridContext } from './context';
import { DataGridHeader } from './data-grid-header';
import { DataGridBody } from './data-grid-body';
import { DataGridPagination } from './data-grid-pagination';
import { DataGridActionDock } from './data-grid-action-dock';
import { DataGridFilters } from './data-grid-filters';

export function DataGrid<TData>({
  data,
  columns,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  onRowSelectionChange,
  actions = [],
  cellContextMenuItems,
  headerContextMenuItems,
  enableCellContextMenu = false,
  enableHeaderContextMenu = false,
  enablePagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  manualPagination = false,
  pageCount,
  totalCount,
  onPaginationChange,
  onDataChange,
  enableSorting = true,
  enableMultiSort = false,
  manualSorting = false,
  onSortingChange,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  manualFiltering = false,
  onGlobalFilterChange,
  onColumnFiltersChange,
  enableCellEditing = false,
  defaultEditMode = 'click',
  onCellEdit,
  onCellEditError,
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
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);

  // Enhanced columns with selection column if needed
  const enhancedColumns = useMemo(() => {
    const cols = [...columns];
    if (enableRowSelection) {
      cols.unshift({
        id: 'select',
        header: ({ table }: { table: Table<TData> }) => (
          <div className='flex items-center justify-center'>
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false
              }
              onCheckedChange={(checked) => {
                if (checked === 'indeterminate') {
                  return;
                }
                table.toggleAllPageRowsSelected(checked);
              }}
              aria-label='Select all rows'
              className='size-3.5'
            />
          </div>
        ),
        cell: ({ row }: { row: Row<TData> }) => (
          <div className='flex items-center justify-center'>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(checked) => {
                if (checked === 'indeterminate') {
                  return;
                }
                row.toggleSelected(checked);
              }}
              aria-label={`Select row ${row.index + 1}`}
              className='size-3.5'
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 60,
      } as any);
    }

    return cols;
  }, [columns, enableRowSelection]);
  // Table instance
  const table = useReactTable({
    data,
    columns: enhancedColumns as any,
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
    pageCount: manualPagination ? (pageCount ?? -1) : undefined,
    meta: {
      totalCount,
    },
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
      cellContextMenuItems,
      headerContextMenuItems,
      enableCellContextMenu,
      enableHeaderContextMenu,
      enableCellEditing,
      defaultEditMode,
      editingCell,
      setEditingCell,
      onCellEdit,
      onCellEditError,
      isLoading,
      error,
    }),
    [
      table,
      selectedRows,
      actions,
      cellContextMenuItems,
      headerContextMenuItems,
      enableCellContextMenu,
      enableHeaderContextMenu,
      enableCellEditing,
      defaultEditMode,
      editingCell,
      setEditingCell,
      onCellEdit,
      onCellEditError,
      isLoading,
      error,
    ]
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

  // Server-side data change effect
  React.useEffect(() => {
    if (onDataChange && (manualPagination || manualSorting || manualFiltering)) {
      const params = {
        pagination: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
        sorting: sorting.map((sort) => ({
          id: sort.id,
          desc: sort.desc,
        })),
        filters: columnFilters.map((filter) => ({
          id: filter.id,
          value: filter.value,
        })),
        globalFilter,
      };
      onDataChange(params);
    }
  }, [
    pagination,
    sorting,
    columnFilters,
    globalFilter,
    onDataChange,
    manualPagination,
    manualSorting,
    manualFiltering,
  ]);

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
        <div className='rounded-md border border-border bg-background'>
          <div className='relative overflow-auto'>
            <table
              className='w-full caption-bottom text-sm border-collapse'
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

        {/* Pagination */}
        {enablePagination && <DataGridPagination pageSizeOptions={pageSizeOptions} />}
      </div>

      {/* Fixed Bottom Action Dock */}
      {enableRowSelection && selectedRows.length > 0 && actions.length > 0 && <DataGridActionDock />}
    </DataGridContext.Provider>
  );
}
