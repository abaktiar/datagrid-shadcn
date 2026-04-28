import {
  Row,
  Table,
  Column,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnOrderState,
  ExpandedState,
  Updater,
} from '@tanstack/react-table';
import type { CSSProperties, ReactNode, ComponentType, MouseEvent as ReactMouseEvent } from 'react';

// ---------------- Meta columns (select / expand) ----------------

export const META_COLUMN_IDS = { select: 'select', expand: 'expand' } as const;
export type MetaColumnId = (typeof META_COLUMN_IDS)[keyof typeof META_COLUMN_IDS];
export function isMetaColumn(id: string): boolean {
  return id === META_COLUMN_IDS.select || id === META_COLUMN_IDS.expand;
}

// ---------------- Pinning style (shared by header + body cells) ----------------

export function getPinningStyles<TData>(
  column: Column<TData, unknown>,
  zIndex: number,
  background?: string
): CSSProperties {
  const pinned = column.getIsPinned();
  if (!pinned) return {};
  return {
    position: 'sticky',
    left: pinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: pinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    zIndex,
    ...(background ? { background } : {}),
  };
}

// ---------------- Cell range helpers ----------------

export function normalizeCellRange(range: { startRowIndex: number; endRowIndex: number; startColIndex: number; endColIndex: number }) {
  return {
    r1: Math.min(range.startRowIndex, range.endRowIndex),
    r2: Math.max(range.startRowIndex, range.endRowIndex),
    c1: Math.min(range.startColIndex, range.endColIndex),
    c2: Math.max(range.startColIndex, range.endColIndex),
  };
}

// ---------------- Interactive target detection (row click guards) ----------------

const INTERACTIVE_TARGET_SELECTOR =
  'input, textarea, select, button, a, [role=checkbox], [role=menuitem], [data-row-action], [contenteditable=true]';

export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest(INTERACTIVE_TARGET_SELECTOR);
}

// ---------------- Cell editing ----------------

export type CellEditMode = 'click' | 'doubleClick';
export type CellEditTrigger = 'blur' | 'enter' | 'escape' | 'manual' | 'immediate';

export interface CellEditBehavior {
  mode?: CellEditMode;
  saveOn?: CellEditTrigger[];
  cancelOn?: CellEditTrigger[];
  showActionButtons?: boolean;
  buttonPosition?: 'top-right' | 'bottom-right';
  autoSave?: boolean;
  autoFocus?: boolean;
  selectAllOnFocus?: boolean;
}

export interface CellEditConfig<TData, TValue = any> {
  enabled: boolean;
  behavior?: CellEditBehavior;
  component?: ComponentType<CellEditComponentProps<TData, TValue>>;
  validate?: (value: TValue, row: Row<TData>) => string | null;
  onSave?: (value: TValue, row: Row<TData>, column: Column<TData>) => Promise<boolean> | boolean;
  onCancel?: (row: Row<TData>, column: Column<TData>) => void;
  onEditStart?: (row: Row<TData>, column: Column<TData>) => void;
  onEditEnd?: (row: Row<TData>, column: Column<TData>) => void;
  placeholder?: string;
  disabled?: (row: Row<TData>) => boolean;
}

export interface CellEditComponentProps<TData, TValue = any> {
  value: TValue;
  onChange: (value: TValue) => void;
  onSave: () => void;
  onCancel: () => void;
  onExit: () => void;
  row: Row<TData>;
  column: Column<TData>;
  config: CellEditConfig<TData, TValue>;
  isSaving: boolean;
  error: string | null;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  selectAllOnFocus?: boolean;
}

export interface QuickEditConfig<TData, TValue = any> {
  component?: ComponentType<CellEditComponentProps<TData, TValue>>;
  validate?: (value: TValue, row: Row<TData>) => string | null;
  onSave?: (value: TValue, row: Row<TData>, column: Column<TData>) => Promise<boolean> | boolean;
  placeholder?: string;
  disabled?: (row: Row<TData>) => boolean;
}

export const EditBehaviors = {
  clickToEdit: {
    mode: 'click' as CellEditMode,
    saveOn: ['blur', 'enter'] as CellEditTrigger[],
    cancelOn: ['escape'] as CellEditTrigger[],
    showActionButtons: false,
    autoFocus: true,
    selectAllOnFocus: true,
  },
  clickWithButtons: {
    mode: 'click' as CellEditMode,
    saveOn: ['manual'] as CellEditTrigger[],
    cancelOn: ['manual'] as CellEditTrigger[],
    showActionButtons: true,
    buttonPosition: 'top-right' as const,
    autoFocus: true,
    selectAllOnFocus: true,
  },
  doubleClickToEdit: {
    mode: 'doubleClick' as CellEditMode,
    saveOn: ['blur', 'enter'] as CellEditTrigger[],
    cancelOn: ['escape'] as CellEditTrigger[],
    showActionButtons: false,
    autoFocus: true,
    selectAllOnFocus: true,
  },
} as const;

// ---------------- Column filter ----------------

export type ColumnFilterType = 'text' | 'number' | 'numberRange' | 'select' | 'multiSelect' | 'date' | 'dateRange' | 'boolean';

export interface ColumnFilterOption {
  value: string;
  label: string;
}

export interface ColumnFilterConfig<TData = any> {
  type: ColumnFilterType;
  options?: ColumnFilterOption[];
  placeholder?: string;
  /** Custom render — receives column and current value, returns a node */
  render?: (column: Column<TData>, value: any, setValue: (next: any) => void) => ReactNode;
}

// ---------------- Column / actions / context menu ----------------

export interface DataGridColumn<TData> {
  id: string;
  header: string | ReactNode;
  accessorKey?: keyof TData;
  cell?: ({ row }: { row: Row<TData> }) => ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableHiding?: boolean;
  enableResizing?: boolean;
  enablePinning?: boolean;
  enableEditing?: boolean | CellEditConfig<TData>;
  filter?: ColumnFilterConfig<TData>;
  size?: number;
  minSize?: number;
  maxSize?: number;
  [key: string]: any;
}

export interface DataGridAction<TData> {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (selectedRows: Row<TData>[]) => void | Promise<void>;
  isEnabled?: (selectedRows: Row<TData>[]) => boolean;
  isVisible?: (selectedRows: Row<TData>[]) => boolean;
}

export interface CellContextMenuItem<TData> {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (row: Row<TData>, column: Column<TData>, value: any) => void | Promise<void>;
  isEnabled?: (row: Row<TData>, column: Column<TData>, value: any) => boolean;
  isVisible?: (row: Row<TData>, column: Column<TData>, value: any) => boolean;
  separator?: boolean;
  variant?: 'default' | 'destructive';
}

export interface HeaderContextMenuItem<TData> {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (column: Column<TData>) => void | Promise<void>;
  isEnabled?: (column: Column<TData>) => boolean;
  isVisible?: (column: Column<TData>) => boolean;
  separator?: boolean;
  variant?: 'default' | 'destructive';
}

// ---------------- Server-side ----------------

export interface DataChangeParams {
  pagination: { pageIndex: number; pageSize: number };
  sorting: Array<{ id: string; desc: boolean }>;
  filters: Array<{ id: string; value: any }>;
  globalFilter: string;
}

// ---------------- i18n labels ----------------

export interface DataGridLabels {
  search?: string;
  view?: string;
  toggleColumns?: string;
  rowsPerPage?: string;
  page?: (current: number, total: number) => string;
  rowRange?: (start: number, end: number, total: number) => string;
  selected?: (n: number, total: number) => string;
  noData?: string;
  loading?: string;
  error?: (message: string) => string;
  firstPage?: string;
  previousPage?: string;
  nextPage?: string;
  lastPage?: string;
  selectAll?: string;
  selectRow?: (index: number) => string;
  expandRow?: string;
  collapseRow?: string;
  clearSelection?: string;
  more?: string;
  filter?: string;
  apply?: string;
  clear?: string;
  density?: string;
  densityCompact?: string;
  densityNormal?: string;
  densityComfortable?: string;
  export?: string;
  exportCsv?: string;
  exportJson?: string;
  exportSelected?: string;
  exportAll?: string;
}

// ---------------- Density ----------------

export type DataGridDensity = 'compact' | 'normal' | 'comfortable';

// ---------------- Action dock ----------------

export interface DockOptions {
  primaryActionCount?: number;
  position?: 'top' | 'bottom';
}

// ---------------- Main props ----------------

export interface DataGridProps<TData> {
  data: TData[];
  columns: DataGridColumn<TData>[];

  // Identity
  getRowId?: (row: TData, index: number) => string;

  // Selection (controlled or uncontrolled)
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  defaultRowSelection?: RowSelectionState;
  /** Rich callback — receives resolved Row objects. Fires after state updates (in an effect). */
  onRowSelectionChange?: (selectedRows: Row<TData>[], state: RowSelectionState) => void;
  /** State-only callback — fires synchronously with the next RowSelectionState.
   *  Required if you control selection by passing `rowSelection`. */
  onRowSelectionStateChange?: (state: RowSelectionState) => void;

  // Actions
  actions?: DataGridAction<TData>[];
  dockOptions?: DockOptions;

  // Context menus
  cellContextMenuItems?: CellContextMenuItem<TData>[];
  headerContextMenuItems?: HeaderContextMenuItem<TData>[];
  enableCellContextMenu?: boolean;
  enableHeaderContextMenu?: boolean;

  // Pagination (controlled or uncontrolled)
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  manualPagination?: boolean;
  pageCount?: number;
  totalCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (state: PaginationState) => void;

  // Sorting
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  manualSorting?: boolean;
  sorting?: SortingState;
  defaultSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  // Filtering
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  manualFiltering?: boolean;
  globalFilter?: string;
  defaultGlobalFilter?: string;
  columnFilters?: ColumnFiltersState;
  defaultColumnFilters?: ColumnFiltersState;
  onGlobalFilterChange?: (globalFilter: string) => void;
  onColumnFiltersChange?: (columnFilters: ColumnFiltersState) => void;

  // Column visibility / sizing / pinning / order
  columnVisibility?: VisibilityState;
  defaultColumnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (state: VisibilityState) => void;

  columnSizing?: ColumnSizingState;
  defaultColumnSizing?: ColumnSizingState;
  onColumnSizingChange?: (state: ColumnSizingState) => void;

  enableColumnPinning?: boolean;
  columnPinning?: ColumnPinningState;
  defaultColumnPinning?: ColumnPinningState;
  onColumnPinningChange?: (state: ColumnPinningState) => void;

  enableColumnReordering?: boolean;
  columnOrder?: ColumnOrderState;
  defaultColumnOrder?: ColumnOrderState;
  onColumnOrderChange?: (state: ColumnOrderState) => void;

  // Server-side data loading
  onDataChange?: (params: DataChangeParams) => void;
  serverDebounceMs?: number;

  // Cell editing
  enableCellEditing?: boolean;
  defaultEditMode?: CellEditMode;
  onCellEdit?: (
    value: any,
    row: Row<TData>,
    column: Column<TData>,
    oldValue: any
  ) => Promise<boolean> | boolean;
  onCellValueChange?: (rowId: string, columnId: string, oldValue: any, newValue: any) => void;
  onCellEditError?: (error: string, row: Row<TData>, column: Column<TData>) => void;

  // Column resizing
  enableColumnResizing?: boolean;

  // Virtualization
  enableVirtualization?: boolean;
  estimateSize?: number;

  // Row expansion
  enableRowExpansion?: boolean;
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  expanded?: ExpandedState;
  defaultExpanded?: ExpandedState;
  onExpandedChange?: (state: ExpandedState) => void;

  // Row interactions
  onRowClick?: (row: Row<TData>, e: ReactMouseEvent<HTMLTableRowElement>) => void;
  onRowDoubleClick?: (row: Row<TData>, e: ReactMouseEvent<HTMLTableRowElement>) => void;
  rowClassName?: string | ((row: Row<TData>) => string);

  // Cell selection / range selection
  enableCellSelection?: boolean;

  // Keyboard navigation
  enableKeyboardNavigation?: boolean;

  // Density
  density?: DataGridDensity;
  defaultDensity?: DataGridDensity;
  onDensityChange?: (density: DataGridDensity) => void;
  enableDensityToggle?: boolean;

  // Export
  enableExport?: boolean;
  exportFileName?: string;

  // Layout
  maxHeight?: string | number;
  stickyHeader?: boolean;

  // Loading & Error states
  isLoading?: boolean;
  error?: string | null;
  loadingRowCount?: number;
  emptyState?: ReactNode | (() => ReactNode);
  loadingState?: ReactNode | (() => ReactNode);
  errorState?: ReactNode | ((error: string) => ReactNode);

  // i18n
  labels?: DataGridLabels;

  // Styling
  className?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export interface DataGridState {
  rowSelection: RowSelectionState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  pagination: PaginationState;
  columnVisibility: VisibilityState;
  columnSizing: ColumnSizingState;
  columnPinning: ColumnPinningState;
  columnOrder: ColumnOrderState;
  expanded: ExpandedState;
}

export interface FocusedCell {
  rowId: string;
  columnId: string;
}

export interface CellRange {
  startRowIndex: number;
  endRowIndex: number;
  startColIndex: number;
  endColIndex: number;
}

export interface DataGridContextValue<TData> {
  table: Table<TData>;
  selectedRows: Row<TData>[];
  actions: DataGridAction<TData>[];
  cellContextMenuItems?: CellContextMenuItem<TData>[];
  headerContextMenuItems?: HeaderContextMenuItem<TData>[];
  enableCellContextMenu: boolean;
  enableHeaderContextMenu: boolean;
  enableCellEditing: boolean;
  defaultEditMode: CellEditMode;
  editingCell: { rowId: string; columnId: string } | null;
  setEditingCell: (cell: { rowId: string; columnId: string } | null) => void;
  onCellEdit?: (
    value: any,
    row: Row<TData>,
    column: Column<TData>,
    oldValue: any
  ) => Promise<boolean> | boolean;
  onCellValueChange?: (rowId: string, columnId: string, oldValue: any, newValue: any) => void;
  onCellEditError?: (error: string, row: Row<TData>, column: Column<TData>) => void;
  isLoading: boolean;
  error: string | null;
  labels: Required<DataGridLabels>;
  density: DataGridDensity;
  enableColumnPinning: boolean;
  enableColumnReordering: boolean;
  enableRowExpansion: boolean;
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
  enableCellSelection: boolean;
  enableKeyboardNavigation: boolean;
  focusedCell: FocusedCell | null;
  setFocusedCell: (cell: FocusedCell | null) => void;
  cellRange: CellRange | null;
  setCellRange: (range: CellRange | null) => void;
  rowClassName?: string | ((row: Row<TData>) => string);
  onRowClick?: (row: Row<TData>, e: ReactMouseEvent<HTMLTableRowElement>) => void;
  onRowDoubleClick?: (row: Row<TData>, e: ReactMouseEvent<HTMLTableRowElement>) => void;
  loadingRowCount: number;
  emptyState?: ReactNode | (() => ReactNode);
  loadingState?: ReactNode | (() => ReactNode);
  errorState?: ReactNode | ((error: string) => ReactNode);
}

// Helper for controlled/uncontrolled state plumbing
export type StateUpdater<T> = Updater<T>;
