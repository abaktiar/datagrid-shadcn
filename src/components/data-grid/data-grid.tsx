'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Checkbox } from '../ui/checkbox';
import {
  CellRange,
  DataGridContextValue,
  DataGridDensity,
  DataGridProps,
  FocusedCell,
  META_COLUMN_IDS,
  isInteractiveTarget,
  isMetaColumn,
  normalizeCellRange,
} from './types';
import { DataGridContext } from './context';
import { DataGridHeader } from './data-grid-header';
import { DataGridBody } from './data-grid-body';
import { DataGridPagination } from './data-grid-pagination';
import { DataGridActionDock } from './data-grid-action-dock';
import { DataGridFilters } from './data-grid-filters';
import { mergeLabels } from './labels';
import { copySelectionAsTSV } from './export-utils';

function useControllable<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void
): [T, (updater: Updater<T>) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : internal;

  const set = useCallback(
    (updater: Updater<T>) => {
      const next = typeof updater === 'function' ? (updater as (old: T) => T)(value) : updater;
      if (Object.is(next, value)) return;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange, value]
  );

  return [value, set];
}

export function DataGrid<TData>(props: DataGridProps<TData>) {
  const {
    data,
    columns,
    getRowId: userGetRowId,

    // Selection
    enableRowSelection = false,
    enableMultiRowSelection = true,
    rowSelection: rowSelectionProp,
    defaultRowSelection,
    onRowSelectionChange,
    onRowSelectionStateChange,

    // Actions
    actions = [],
    dockOptions,

    // Context menus
    cellContextMenuItems,
    headerContextMenuItems,
    enableCellContextMenu = false,
    enableHeaderContextMenu = false,

    // Pagination
    enablePagination = true,
    pageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    manualPagination = false,
    pageCount,
    totalCount,
    pagination: paginationProp,
    onPaginationChange,

    // Sorting
    enableSorting = true,
    enableMultiSort = false,
    manualSorting = false,
    sorting: sortingProp,
    defaultSorting,
    onSortingChange,

    // Filtering
    enableGlobalFilter = true,
    enableColumnFilters = true,
    manualFiltering = false,
    globalFilter: globalFilterProp,
    defaultGlobalFilter,
    columnFilters: columnFiltersProp,
    defaultColumnFilters,
    onGlobalFilterChange,
    onColumnFiltersChange,

    // Visibility / sizing / pinning / order
    columnVisibility: columnVisibilityProp,
    defaultColumnVisibility,
    onColumnVisibilityChange,

    columnSizing: columnSizingProp,
    defaultColumnSizing,
    onColumnSizingChange,

    enableColumnPinning = false,
    columnPinning: columnPinningProp,
    defaultColumnPinning,
    onColumnPinningChange,

    enableColumnReordering = false,
    columnOrder: columnOrderProp,
    defaultColumnOrder,
    onColumnOrderChange,

    // Server
    onDataChange,
    serverDebounceMs = 300,

    // Editing
    enableCellEditing = false,
    defaultEditMode = 'click',
    onCellEdit,
    onCellValueChange,
    onCellEditError,

    // Resizing
    enableColumnResizing = true,

    // Virtualization
    enableVirtualization = false,
    estimateSize = 35,

    // Expansion
    enableRowExpansion = false,
    renderExpandedRow,
    getRowCanExpand,
    expanded: expandedProp,
    defaultExpanded,
    onExpandedChange,

    // Row interactions
    onRowClick,
    onRowDoubleClick,
    rowClassName,

    // Cell selection
    enableCellSelection = false,

    // Keyboard nav
    enableKeyboardNavigation = true,

    // Density
    density: densityProp,
    defaultDensity = 'normal',
    onDensityChange,
    enableDensityToggle = false,

    // Export
    enableExport = false,
    exportFileName,

    // Layout
    maxHeight,
    stickyHeader = false,

    // States
    isLoading = false,
    error = null,
    loadingRowCount = 5,
    emptyState,
    loadingState,
    errorState,

    // i18n
    labels: labelsProp,

    className,
    'aria-label': ariaLabel = 'Data grid',
    'aria-describedby': ariaDescribedBy,
  } = props;

  const labels = useMemo(() => mergeLabels(labelsProp), [labelsProp]);

  // ---------------- Controlled / uncontrolled state ----------------

  // Dev-time check: controlled selection requires a state-change callback so the
  // parent can actually update the value it owns.
  if (
    process.env.NODE_ENV !== 'production' &&
    rowSelectionProp !== undefined &&
    !onRowSelectionStateChange
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      '[DataGrid] You passed a controlled `rowSelection` prop without `onRowSelectionStateChange`. ' +
        'User interactions will not update the value because the consumer owns it. ' +
        'Pass `onRowSelectionStateChange` to receive the next RowSelectionState.'
    );
  }

  const [rowSelection, setRowSelection] = useControllable<RowSelectionState>(
    rowSelectionProp,
    defaultRowSelection ?? {},
    onRowSelectionStateChange
  );
  const [sorting, setSorting] = useControllable<SortingState>(
    sortingProp,
    defaultSorting ?? [],
    onSortingChange
  );
  const [columnFilters, setColumnFilters] = useControllable<ColumnFiltersState>(
    columnFiltersProp,
    defaultColumnFilters ?? [],
    onColumnFiltersChange
  );
  const [globalFilter, setGlobalFilter] = useControllable<string>(
    globalFilterProp,
    defaultGlobalFilter ?? '',
    onGlobalFilterChange
  );
  const [columnVisibility, setColumnVisibility] = useControllable<VisibilityState>(
    columnVisibilityProp,
    defaultColumnVisibility ?? {},
    onColumnVisibilityChange
  );
  const [columnSizing, setColumnSizing] = useControllable<ColumnSizingState>(
    columnSizingProp,
    defaultColumnSizing ?? {},
    onColumnSizingChange
  );
  const [columnPinning, setColumnPinning] = useControllable<ColumnPinningState>(
    columnPinningProp,
    defaultColumnPinning ?? { left: [], right: [] },
    onColumnPinningChange
  );
  const [columnOrder, setColumnOrder] = useControllable<ColumnOrderState>(
    columnOrderProp,
    defaultColumnOrder ?? [],
    onColumnOrderChange
  );
  const [pagination, setPagination] = useControllable<PaginationState>(
    paginationProp,
    { pageIndex: 0, pageSize },
    onPaginationChange
  );
  const [expanded, setExpanded] = useControllable<ExpandedState>(
    expandedProp,
    defaultExpanded ?? {},
    onExpandedChange
  );
  const [density, setDensity] = useControllable<DataGridDensity>(densityProp, defaultDensity, onDensityChange);

  const tableRef = useRef<Table<TData> | null>(null);

  // ---------------- Editing state ----------------

  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);

  // ---------------- Focus + range selection state ----------------

  const [focusedCell, setFocusedCell] = useState<FocusedCell | null>(null);
  const [cellRange, setCellRange] = useState<CellRange | null>(null);

  // ---------------- Enhanced columns: select + expand ----------------

  const enhancedColumns = useMemo(() => {
    const cols: ColumnDef<TData, any>[] = [];

    if (enableRowExpansion) {
      cols.push({
        id: META_COLUMN_IDS.expand,
        header: () => null,
        cell: ({ row }: { row: Row<TData> }) => {
          if (!row.getCanExpand()) return null;
          const isExpanded = row.getIsExpanded();
          return (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                row.toggleExpanded();
              }}
              aria-label={isExpanded ? labels.collapseRow : labels.expandRow}
              className='inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted/70'>
              {isExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
            </button>
          );
        },
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 36,
      });
    }

    if (enableRowSelection) {
      cols.push({
        id: META_COLUMN_IDS.select,
        header: ({ table }: { table: Table<TData> }) => {
          const isAll = table.getIsAllPageRowsSelected();
          const isSome = table.getIsSomePageRowsSelected();
          return (
            <div className='flex items-center justify-center'>
              <Checkbox
                checked={isAll}
                indeterminate={!isAll && isSome}
                onCheckedChange={(checked) => {
                  table.toggleAllPageRowsSelected(Boolean(checked));
                }}
                aria-label={labels.selectAll}
                className='size-3.5'
              />
            </div>
          );
        },
        cell: ({ row }: { row: Row<TData> }) => (
          <div className='flex items-center justify-center' onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
              aria-label={labels.selectRow(row.index)}
              className='size-3.5'
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 44,
      });
    }

    for (const col of columns) {
      cols.push(col as unknown as ColumnDef<TData, any>);
    }

    return cols;
  }, [columns, enableRowSelection, enableRowExpansion, labels]);

  // ---------------- TanStack Table ----------------

  const table = useReactTable<TData>({
    data,
    columns: enhancedColumns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
      columnSizing,
      columnPinning,
      columnOrder,
      globalFilter,
      pagination,
      expanded,
    },
    enableRowSelection,
    enableMultiRowSelection,
    enableMultiSort,
    enableColumnResizing,
    enableColumnPinning,
    enableExpanding: enableRowExpansion,
    columnResizeMode: 'onChange',
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableGlobalFilter || enableColumnFilters ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getExpandedRowModel: enableRowExpansion ? getExpandedRowModel() : undefined,
    getRowCanExpand: enableRowExpansion ? getRowCanExpand ?? (() => true) : undefined,
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount: manualPagination ? (pageCount ?? -1) : undefined,
    meta: { totalCount },
    getRowId:
      userGetRowId ??
      ((row, index) => {
        const id = (row as any)?.id;
        return id != null ? String(id) : String(index);
      }),
  });

  tableRef.current = table;

  // ---------------- Row-selection rich callback (provides Row objects) ----------------
  // Kept as an effect because the consumer needs Row instances, which the table only
  // resolves after re-rendering with the new selection state.
  const onRowSelectionChangeRef = useRef(onRowSelectionChange);
  onRowSelectionChangeRef.current = onRowSelectionChange;

  useEffect(() => {
    const cb = onRowSelectionChangeRef.current;
    if (!cb) return;
    const rows = table.getFilteredSelectedRowModel().rows;
    cb(rows, rowSelection);
  }, [rowSelection, table]);

  // ---------------- Server-side data change with debounce ----------------

  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  const lastSentRef = useRef<{
    pageIndex: number;
    pageSize: number;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    globalFilter: string;
  } | null>(null);
  useEffect(() => {
    const cb = onDataChangeRef.current;
    if (!cb) return;
    if (!manualPagination && !manualSorting && !manualFiltering) return;

    const prev = lastSentRef.current;
    const next = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      columnFilters,
      globalFilter,
    };

    if (
      prev &&
      prev.pageIndex === next.pageIndex &&
      prev.pageSize === next.pageSize &&
      prev.sorting === next.sorting &&
      prev.columnFilters === next.columnFilters &&
      prev.globalFilter === next.globalFilter
    ) {
      return;
    }

    // Debounce only the global filter typing — pagination/sort/column-filters fire immediately
    const onlyGlobalChanged =
      prev &&
      prev.pageIndex === next.pageIndex &&
      prev.pageSize === next.pageSize &&
      prev.sorting === next.sorting &&
      prev.columnFilters === next.columnFilters &&
      prev.globalFilter !== next.globalFilter;

    const delay = onlyGlobalChanged ? serverDebounceMs : 0;

    const handle = window.setTimeout(() => {
      lastSentRef.current = next;
      cb({
        pagination: { pageIndex: next.pageIndex, pageSize: next.pageSize },
        sorting: next.sorting.map((s) => ({ id: s.id, desc: s.desc })),
        filters: next.columnFilters.map((f) => ({ id: f.id, value: f.value })),
        globalFilter: next.globalFilter,
      });
    }, delay);

    return () => window.clearTimeout(handle);
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    columnFilters,
    globalFilter,
    manualPagination,
    manualSorting,
    manualFiltering,
    serverDebounceMs,
  ]);

  // ---------------- Selected rows ----------------

  const selectedRows = useMemo(
    () => table.getFilteredSelectedRowModel().rows,
    // intentionally key on rowSelection so we re-evaluate
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rowSelection, table]
  );

  // ---------------- Ctrl+C — copy selected rows or range as TSV ----------------

  const cellRangeRef = useRef(cellRange);
  cellRangeRef.current = cellRange;
  const selectedRowsRef = useRef(selectedRows);
  selectedRowsRef.current = selectedRows;

  useEffect(() => {
    if (!enableCellSelection && !enableRowSelection) return;
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key !== 'c') return;
      if (isInteractiveTarget(e.target)) return;
      const range = cellRangeRef.current;
      const selected = selectedRowsRef.current;
      // Range first
      if (range) {
        const visibleCols = table.getVisibleLeafColumns().filter((c) => !isMetaColumn(c.id));
        const rows = table.getRowModel().rows;
        const { r1, r2, c1, c2 } = normalizeCellRange(range);
        const matrix: any[][] = [];
        for (let r = r1; r <= r2 && r < rows.length; r++) {
          const row = rows[r];
          const line: any[] = [];
          for (let c = c1; c <= c2 && c < visibleCols.length; c++) {
            line.push(row.getValue(visibleCols[c].id));
          }
          matrix.push(line);
        }
        if (matrix.length > 0) {
          copySelectionAsTSV(matrix);
          e.preventDefault();
          return;
        }
      }
      // Else: selected rows
      if (selected.length > 0) {
        const visibleCols = table.getVisibleLeafColumns().filter((c) => !isMetaColumn(c.id));
        const matrix = selected.map((row) => visibleCols.map((c) => row.getValue(c.id)));
        copySelectionAsTSV(matrix);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enableCellSelection, enableRowSelection, table]);

  // ---------------- Context value ----------------

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
      onCellValueChange,
      onCellEditError,
      isLoading,
      error,
      labels,
      density,
      enableColumnPinning,
      enableColumnReordering,
      enableRowExpansion,
      renderExpandedRow,
      enableCellSelection,
      enableKeyboardNavigation,
      focusedCell,
      setFocusedCell,
      cellRange,
      setCellRange,
      rowClassName,
      onRowClick,
      onRowDoubleClick,
      loadingRowCount,
      emptyState,
      loadingState,
      errorState,
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
      onCellEdit,
      onCellValueChange,
      onCellEditError,
      isLoading,
      error,
      labels,
      density,
      enableColumnPinning,
      enableColumnReordering,
      enableRowExpansion,
      renderExpandedRow,
      enableCellSelection,
      enableKeyboardNavigation,
      focusedCell,
      cellRange,
      rowClassName,
      onRowClick,
      onRowDoubleClick,
      loadingRowCount,
      emptyState,
      loadingState,
      errorState,
    ]
  );

  // ---------------- aria-rowcount: total rows + 1 (header) ----------------

  const totalRowsForAria =
    manualPagination && totalCount != null ? totalCount : table.getFilteredRowModel().rows.length;

  const tableContainerStyle: React.CSSProperties = {};
  if (maxHeight !== undefined) tableContainerStyle.maxHeight = maxHeight;

  return (
    <DataGridContext.Provider value={contextValue}>
      <div
        className={cn('space-y-4', className)}
        role='region'
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        data-density={density}>
        {(enableGlobalFilter || enableColumnFilters || enableDensityToggle || enableExport) && (
          <DataGridFilters
            enableGlobalFilter={enableGlobalFilter}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            enableDensityToggle={enableDensityToggle}
            density={density}
            onDensityChange={(d) => setDensity(d)}
            enableExport={enableExport}
            exportFileName={exportFileName}
          />
        )}

        <div className='rounded-md border border-border bg-background'>
          <div
            className={cn('relative overflow-auto', stickyHeader && 'overflow-y-auto')}
            style={tableContainerStyle}>
            <table
              className='w-full caption-bottom text-sm border-collapse'
              role='grid'
              aria-rowcount={totalRowsForAria + 1}
              style={{ width: table.getCenterTotalSize() + table.getLeftTotalSize() + table.getRightTotalSize() }}>
              <DataGridHeader stickyHeader={stickyHeader} />
              <DataGridBody enableVirtualization={enableVirtualization} estimateSize={estimateSize} />
            </table>
          </div>
        </div>

        {enablePagination && <DataGridPagination pageSizeOptions={pageSizeOptions} />}
      </div>

      {enableRowSelection && selectedRows.length > 0 && actions.length > 0 && (
        <DataGridActionDock dockOptions={dockOptions} />
      )}
    </DataGridContext.Provider>
  );
}
