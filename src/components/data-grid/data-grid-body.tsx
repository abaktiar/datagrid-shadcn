'use client';

import { useRef } from 'react';
import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../lib/utils';
import { useDataGrid } from './context';
import { CellContextMenu } from './data-grid-context-menu';
import { EditableCell } from './data-grid-editable-cell';
import { CellEditConfig } from './types';

interface DataGridBodyProps {
  enableVirtualization?: boolean;
  estimateSize?: number;
}

export function DataGridBody({ enableVirtualization = false, estimateSize = 35 }: DataGridBodyProps) {
  const { table, isLoading, error, cellContextMenuItems, enableCellContextMenu, enableCellEditing } = useDataGrid();
  const tableContainerRef = useRef<HTMLTableSectionElement>(null);

  const rows = table.getRowModel().rows;

  // Helper function to render cell content
  const renderCellContent = (cell: any) => {
    const column = cell.column;
    const row = cell.row;
    const value = cell.getValue();

    // Check if this column has editing enabled
    const columnDef = column.columnDef as any;
    const editConfig = columnDef.enableEditing;

    if (enableCellEditing && editConfig) {
      // Determine edit configuration
      const config: CellEditConfig<any> =
        typeof editConfig === 'boolean' ? { enabled: true } : { enabled: true, ...editConfig };

      return <EditableCell row={row} column={column} value={value} editConfig={config} />;
    }

    // Default cell rendering
    return flexRender(column.columnDef.cell, cell.getContext());
  };

  // Virtualization setup
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimateSize,
    enabled: enableVirtualization && rows.length > 50, // Only virtualize for large datasets
  });

  // Loading state
  if (isLoading) {
    return (
      <tbody ref={tableContainerRef}>
        <tr>
          <td colSpan={table.getAllColumns().length} className='h-24 text-center text-muted-foreground'>
            <div className='flex items-center justify-center space-x-2'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
              <span>Loading...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // Error state
  if (error) {
    return (
      <tbody ref={tableContainerRef}>
        <tr>
          <td colSpan={table.getAllColumns().length} className='h-24 text-center text-destructive'>
            <div className='flex items-center justify-center space-x-2'>
              <span>Error: {error}</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // Empty state
  if (rows.length === 0) {
    return (
      <tbody ref={tableContainerRef}>
        <tr>
          <td colSpan={table.getAllColumns().length} className='h-24 text-center text-muted-foreground'>
            No data available
          </td>
        </tr>
      </tbody>
    );
  }

  // Virtualized rendering
  if (enableVirtualization && rowVirtualizer.getVirtualItems().length > 0) {
    const virtualItems = rowVirtualizer.getVirtualItems();

    return (
      <tbody
        ref={tableContainerRef}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}>
        {virtualItems.map((virtualItem) => {
          const row = rows[virtualItem.index];
          return (
            <tr
              key={row.id}
              role='row'
              aria-rowindex={virtualItem.index + 2} // +2 because header is row 1
              aria-selected={row.getIsSelected()}
              className={cn(
                'border-b border-border hover:bg-slate-100 dark:hover:bg-slate-800', // Base styling
                row.getIsSelected() && 'bg-blue-100 text-blue-900 dark:bg-slate-700 dark:text-slate-100' // Updated dark mode selected style
              )}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}>
              {row.getVisibleCells().map((cell) => (
                <CellContextMenu
                  key={cell.id}
                  row={row}
                  column={cell.column}
                  value={cell.getValue()}
                  items={enableCellContextMenu ? cellContextMenuItems : []}>
                  <td
                    role='gridcell'
                    className={cn(
                      'px-3 py-1.5 align-middle text-sm border-r border-border/50 [&:has([role=checkbox])]:pr-0',
                      cell.column.id === 'select' && 'w-12 border-r-0'
                    )}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.columnDef.minSize || 50,
                      maxWidth: cell.column.columnDef.maxSize || 500,
                    }}>
                    {renderCellContent(cell)}
                  </td>
                </CellContextMenu>
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  }

  // Standard rendering
  return (
    <tbody ref={tableContainerRef}>
      {rows.map((row) => (
        <tr
          key={row.id}
          role='row'
          aria-rowindex={row.index + 2} // +2 because header is row 1
          aria-selected={row.getIsSelected()}
          className={cn(
            'border-b border-border hover:bg-slate-100 dark:hover:bg-slate-800', // Base styling
            row.getIsSelected() && 'bg-blue-100 text-blue-900 dark:bg-slate-700 dark:text-slate-100' // Updated dark mode selected style
          )}>
          {row.getVisibleCells().map((cell) => (
            <CellContextMenu
              key={cell.id}
              row={row}
              column={cell.column}
              value={cell.getValue()}
              items={enableCellContextMenu ? cellContextMenuItems : []}>
              <td
                role='gridcell'
                className={cn(
                  'px-3 py-1.5 align-middle text-sm border-r border-border/50 [&:has([role=checkbox])]:pr-0',
                  cell.column.id === 'select' && 'w-12 border-r-0',
                  cell.column.getIsResizing() && 'w-2 border-r-primary'
                )}
                style={{
                  width: cell.column.getSize(),
                  minWidth: cell.column.columnDef.minSize || 50,
                  maxWidth: cell.column.columnDef.maxSize || 500,
                }}>
                {renderCellContent(cell)}
              </td>
            </CellContextMenu>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
