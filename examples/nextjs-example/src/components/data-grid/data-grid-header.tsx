'use client';

import { flexRender } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDataGrid } from './context';
import { HeaderContextMenu } from './data-grid-context-menu';

export function DataGridHeader() {
  const { table, headerContextMenuItems, enableHeaderContextMenu } = useDataGrid();

  return (
    <thead className='[&_tr]:border-b bg-muted/30'>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} role='row'>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const sortDirection = header.column.getIsSorted();

            const headerContent = (
              <th
                role='columnheader'
                aria-sort={
                  sortDirection === 'asc'
                    ? 'ascending'
                    : sortDirection === 'desc'
                    ? 'descending'
                    : canSort
                    ? 'none'
                    : undefined
                }
                className={cn(
                  'h-10 px-3 text-left align-middle font-medium text-foreground text-sm relative border-r border-border/50',
                  '[&:has([role=checkbox])]:pr-0',
                  header.column.id === 'select' && 'border-r-0',
                  header.column.getIsResizing() && 'w-2 border-r-primary',
                  canSort && 'cursor-pointer select-none hover:bg-muted/50'
                )}
                style={{
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize || 50,
                  maxWidth: header.column.columnDef.maxSize || 500,
                }}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}>
                <div className='flex items-center space-x-2'>
                  <div className='flex-1'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>

                  {canSort && (
                    <div className='flex items-center'>
                      {sortDirection === 'asc' ? (
                        <ArrowUp className='h-4 w-4' />
                      ) : sortDirection === 'desc' ? (
                        <ArrowDown className='h-4 w-4' />
                      ) : (
                        <ArrowUpDown className='h-4 w-4 opacity-50' />
                      )}
                    </div>
                  )}
                </div>

                {/* Column Resizer */}
                {header.column.getCanResize() && (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={cn(
                      'absolute right-0 top-0 h-full w-2 cursor-col-resize select-none touch-none',
                      'bg-transparent hover:bg-transparent transition-colors duration-150',
                      'before:absolute before:left-1/2 before:top-0 before:h-full before:w-px',
                      'before:bg-border/50 before:transform before:-translate-x-1/2 before:transition-colors before:duration-150',
                      'hover:before:bg-primary',
                      header.column.getIsResizing() && 'before:bg-primary'
                    )}
                    style={{
                      transform: 'translateX(50%)',
                    }}
                    title={`Resize ${header.column.columnDef.header} column`}
                  />
                )}
              </th>
            );

            return enableHeaderContextMenu && headerContextMenuItems ? (
              <HeaderContextMenu key={header.id} column={header.column} items={headerContextMenuItems}>
                {headerContent}
              </HeaderContextMenu>
            ) : (
              headerContent
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
