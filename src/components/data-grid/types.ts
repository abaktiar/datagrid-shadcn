import { ColumnDef, Row, Table, Column } from '@tanstack/react-table';
import { ReactNode, ComponentType } from 'react';

// Cell editing types
export type CellEditMode = 'click' | 'doubleClick';

export type CellEditTrigger = 'blur' | 'enter' | 'escape' | 'manual';

export interface CellEditBehavior {
  /** How to trigger edit mode */
  mode?: CellEditMode;
  /** When to save changes */
  saveOn?: CellEditTrigger[];
  /** When to cancel changes */
  cancelOn?: CellEditTrigger[];
  /** Show save/cancel buttons */
  showActionButtons?: boolean;
  /** Position of action buttons when shown */
  buttonPosition?: 'top-right' | 'bottom-right';
  /** Auto-save on blur (legacy support) */
  autoSave?: boolean;
  /** Auto-focus input when editing starts */
  autoFocus?: boolean;
  /** Select all text when editing starts */
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
  /** Current cell value */
  value: TValue;
  /** Update the current value (doesn't save automatically) */
  onChange: (value: TValue) => void;
  /** Manually trigger save */
  onSave: () => void;
  /** Manually trigger cancel */
  onCancel: () => void;
  /** Exit edit mode without saving or canceling */
  onExit: () => void;
  /** Row data */
  row: Row<TData>;
  /** Column definition */
  column: Column<TData>;
  /** Edit configuration */
  config: CellEditConfig<TData, TValue>;
  /** Whether the cell is currently saving */
  isSaving: boolean;
  /** Current validation error, if any */
  error: string | null;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to auto-focus (from config) */
  autoFocus?: boolean;
  /** Whether to select all text on focus (from config) */
  selectAllOnFocus?: boolean;
}

// Utility types for common edit configurations
export interface QuickEditConfig<TData, TValue = any> {
  /** Input component to use */
  component?: ComponentType<CellEditComponentProps<TData, TValue>>;
  /** Validation function */
  validate?: (value: TValue, row: Row<TData>) => string | null;
  /** Save handler */
  onSave?: (value: TValue, row: Row<TData>, column: Column<TData>) => Promise<boolean> | boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Disable editing for certain rows */
  disabled?: (row: Row<TData>) => boolean;
}

// Pre-configured edit behaviors
export const EditBehaviors = {
  /** Click to edit, save on blur or Enter, cancel on Escape */
  clickToEdit: {
    mode: 'click' as CellEditMode,
    saveOn: ['blur', 'enter'] as CellEditTrigger[],
    cancelOn: ['escape'] as CellEditTrigger[],
    showActionButtons: false,
    autoFocus: true,
    selectAllOnFocus: true,
  },
  /** Click to edit with explicit save/cancel buttons */
  clickWithButtons: {
    mode: 'click' as CellEditMode,
    saveOn: ['manual'] as CellEditTrigger[],
    cancelOn: ['manual'] as CellEditTrigger[],
    showActionButtons: true,
    buttonPosition: 'top-right' as const,
    autoFocus: true,
    selectAllOnFocus: true,
  },
  /** Double-click to edit, save on blur */
  doubleClickToEdit: {
    mode: 'doubleClick' as CellEditMode,
    saveOn: ['blur', 'enter'] as CellEditTrigger[],
    cancelOn: ['escape'] as CellEditTrigger[],
    showActionButtons: false,
    autoFocus: true,
    selectAllOnFocus: true,
  },
} as const;

export interface DataGridColumn<TData> {
  id: string;
  header: string | ReactNode;
  accessorKey?: keyof TData;
  cell?: ({ row }: { row: Row<TData> }) => ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableHiding?: boolean;
  enableResizing?: boolean;
  enableEditing?: boolean | CellEditConfig<TData>;
  size?: number;
  minSize?: number;
  maxSize?: number;
  // Allow any other ColumnDef properties
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

export interface DataChangeParams {
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  sorting: Array<{
    id: string;
    desc: boolean;
  }>;
  filters: Array<{
    id: string;
    value: any;
  }>;
  globalFilter: string;
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

  // Context Menus
  cellContextMenuItems?: CellContextMenuItem<TData>[];
  headerContextMenuItems?: HeaderContextMenuItem<TData>[];
  enableCellContextMenu?: boolean;
  enableHeaderContextMenu?: boolean;

  // Pagination
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  manualPagination?: boolean;
  pageCount?: number;
  totalCount?: number;
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

  // Server-side data loading
  onDataChange?: (params: DataChangeParams) => void;

  // Cell editing
  enableCellEditing?: boolean;
  defaultEditMode?: CellEditMode;
  onCellEdit?: (value: any, row: Row<TData>, column: Column<TData>) => Promise<boolean> | boolean;
  onCellEditError?: (error: string, row: Row<TData>, column: Column<TData>) => void;

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
  rowSelection: Record<string, boolean>;
  sorting: any[];
  columnFilters: any[];
  globalFilter: string;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  columnVisibility: Record<string, boolean>;
  columnSizing: Record<string, number>;
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
  onCellEdit?: (value: any, row: Row<TData>, column: Column<TData>) => Promise<boolean> | boolean;
  onCellEditError?: (error: string, row: Row<TData>, column: Column<TData>) => void;
  isLoading: boolean;
  error: string | null;
}
