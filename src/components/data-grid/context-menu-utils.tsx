import { 
  Copy, 
  Pin, 
  PinOff, 
  SortAsc, 
  SortDesc, 
  Filter, 
  FilterX, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Trash2,
  Edit,
  MoreHorizontal,
  Columns
} from 'lucide-react';
import { Column, Row } from '@tanstack/react-table';
import { CellContextMenuItem, HeaderContextMenuItem } from './types';

// Individual Cell Context Menu Items

export const copyCellItem = <TData,>(): CellContextMenuItem<TData> => ({
  id: 'copy-cell',
  label: 'Copy Cell',
  icon: <Copy className='h-4 w-4' />,
  onClick: (row, column, value) => {
    const textValue = String(value || '');
    navigator.clipboard.writeText(textValue);
  },
});

export const copyRowItem = <TData,>(): CellContextMenuItem<TData> => ({
  id: 'copy-row',
  label: 'Copy Row',
  icon: <Copy className='h-4 w-4' />,
  onClick: (row) => {
    const rowData = JSON.stringify(row.original, null, 2);
    navigator.clipboard.writeText(rowData);
  },
});

export const editCellItem = <TData,>(
  onEdit?: (row: Row<TData>, column: Column<TData>, value: any) => void
): CellContextMenuItem<TData> => ({
  id: 'edit-cell',
  label: 'Edit Cell',
  icon: <Edit className='h-4 w-4' />,
  onClick:
    onEdit ||
    ((row, column, value) => {
      console.log('Edit cell:', { row: row.original, column: column.id, value });
    }),
  isEnabled: (row, column) => column.columnDef.enableEditing !== false,
});

export const deleteRowItem = <TData,>(onDelete?: (row: Row<TData>) => void): CellContextMenuItem<TData> => ({
  id: 'delete-row',
  label: 'Delete Row',
  icon: <Trash2 className='h-4 w-4' />,
  variant: 'destructive' as const,
  onClick:
    onDelete ||
    ((row) => {
      console.log('Delete row:', row.original);
    }),
});

export const selectRowItem = <TData,>(): CellContextMenuItem<TData> => ({
  id: 'select-row',
  label: 'Toggle Selection',
  icon: <MoreHorizontal className='h-4 w-4' />,
  onClick: (row) => {
    row.toggleSelected();
  },
});

export const viewRowDetailsItem = <TData,>(onView?: (row: Row<TData>) => void): CellContextMenuItem<TData> => ({
  id: 'view-details',
  label: 'View Details',
  icon: <Eye className='h-4 w-4' />,
  onClick:
    onView ||
    ((row) => {
      console.log('View details:', row.original);
    }),
});

// Individual Header Context Menu Items

export const sortAscendingItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'sort-asc',
  label: 'Sort Ascending',
  icon: <SortAsc className='h-4 w-4' />,
  onClick: (column) => column.toggleSorting(false),
  isEnabled: (column) => column.getCanSort(),
});

export const sortDescendingItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'sort-desc',
  label: 'Sort Descending',
  icon: <SortDesc className='h-4 w-4' />,
  onClick: (column) => column.toggleSorting(true),
  isEnabled: (column) => column.getCanSort(),
});

export const clearSortItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'clear-sort',
  label: 'Clear Sort',
  icon: <MoreHorizontal className='h-4 w-4' />,
  onClick: (column) => column.clearSorting(),
  isEnabled: (column) => column.getIsSorted() !== false,
});

export const filterColumnItem = <TData,>(onFilter?: (column: Column<TData>) => void): HeaderContextMenuItem<TData> => ({
  id: 'filter-column',
  label: 'Filter Column',
  icon: <Filter className='h-4 w-4' />,
  onClick: onFilter || ((column) => console.log('Filter column:', column.id)),
  isEnabled: (column) => column.getCanFilter(),
});

export const clearFilterItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'clear-filter',
  label: 'Clear Filter',
  icon: <FilterX className='h-4 w-4' />,
  onClick: (column) => column.setFilterValue(undefined),
  isEnabled: (column) => column.getFilterValue() !== undefined,
});

export const pinLeftItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'pin-left',
  label: 'Pin Left',
  icon: <Pin className='h-4 w-4' />,
  onClick: (column) => column.pin('left'),
  isEnabled: (column) => column.getCanPin() && column.getIsPinned() !== 'left',
});

export const pinRightItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'pin-right',
  label: 'Pin Right',
  icon: <Pin className='h-4 w-4' />,
  onClick: (column) => column.pin('right'),
  isEnabled: (column) => column.getCanPin() && column.getIsPinned() !== 'right',
});

export const unpinColumnItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'unpin-column',
  label: 'Unpin Column',
  icon: <PinOff className='h-4 w-4' />,
  onClick: (column) => column.pin(false),
  isEnabled: (column) => column.getIsPinned() !== false,
});

export const hideColumnItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'hide-column',
  label: 'Hide Column',
  icon: <EyeOff className='h-4 w-4' />,
  onClick: (column) => column.toggleVisibility(false),
  isEnabled: (column) => column.getCanHide(),
});

export const showColumnItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'show-column',
  label: 'Show Column',
  icon: <Eye className='h-4 w-4' />,
  onClick: (column) => column.toggleVisibility(true),
  isEnabled: (column) => !column.getIsVisible(),
});

export const autoResizeColumnItem = <TData,>(): HeaderContextMenuItem<TData> => ({
  id: 'auto-resize',
  label: 'Auto Resize',
  icon: <Columns className='h-4 w-4' />,
  onClick: (column) => column.resetSize(),
  isEnabled: (column) => column.getCanResize(),
});

// Utility functions for custom context menu items
export const createCopyMenuItem = <TData,>(
  id: string,
  label: string,
  getValue: (row: Row<TData>, column: Column<TData>, value: any) => string
): CellContextMenuItem<TData> => ({
  id,
  label,
  icon: <Copy className="h-4 w-4" />,
  onClick: (row, column, value) => {
    const textValue = getValue(row, column, value);
    navigator.clipboard.writeText(textValue);
  },
});

export const createEditMenuItem = <TData,>(
  id: string,
  label: string,
  onEdit: (row: Row<TData>, column: Column<TData>, value: any) => void
): CellContextMenuItem<TData> => ({
  id,
  label,
  icon: <Edit className="h-4 w-4" />,
  onClick: onEdit,
});

export const createDeleteMenuItem = <TData,>(
  id: string,
  label: string,
  onDelete: (row: Row<TData>) => void
): CellContextMenuItem<TData> => ({
  id,
  label,
  icon: <Trash2 className="h-4 w-4" />,
  variant: 'destructive',
  onClick: (row) => onDelete(row),
});

// Separator utilities
export const cellSeparator = <TData,>(id: string): CellContextMenuItem<TData> => ({
  id,
  label: '',
  separator: true,
  onClick: () => {},
});

export const headerSeparator = <TData,>(id: string): HeaderContextMenuItem<TData> => ({
  id,
  label: '',
  separator: true,
  onClick: () => {},
});

// Convenience bundles for common use cases (optional)
export const commonCellItems = <TData,>() => [
  copyCellItem<TData>(),
  copyRowItem<TData>(),
  cellSeparator<TData>('sep-1'),
  selectRowItem<TData>(),
];

export const commonHeaderItems = <TData,>() => [
  sortAscendingItem<TData>(),
  sortDescendingItem<TData>(),
  clearSortItem<TData>(),
  headerSeparator<TData>('sep-1'),
  filterColumnItem<TData>(),
  clearFilterItem<TData>(),
  headerSeparator<TData>('sep-2'),
  pinLeftItem<TData>(),
  pinRightItem<TData>(),
  unpinColumnItem<TData>(),
  headerSeparator<TData>('sep-3'),
  hideColumnItem<TData>(),
  autoResizeColumnItem<TData>(),
];
