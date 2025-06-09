import { flexRender } from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDataGrid } from './context'
import { HeaderContextMenu } from './data-grid-context-menu';

export function DataGridHeader() {
  const { table } = useDataGrid();

  return (
    <thead className='[&_tr]:border-b'>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} role='row'>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const sortDirection = header.column.getIsSorted();

            return (
              <HeaderContextMenu
                key={header.id}
                column={header.column}
                onSort={(direction) => {
                  if (direction === 'asc') {
                    header.column.toggleSorting(false);
                  } else if (direction === 'desc') {
                    header.column.toggleSorting(true);
                  } else {
                    header.column.clearSorting();
                  }
                }}
                onFilter={() => {
                  // Could implement filter dialog here
                  console.log('Filter column:', header.column.id);
                }}
                onHide={() => {
                  console.log('Hide column:', header.column.id);
                }}
                onPin={(direction) => {
                  console.log('Pin column:', header.column.id, direction);
                }}>
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
                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground relative',
                    '[&:has([role=checkbox])]:pr-0',
                    canSort && 'cursor-pointer select-none hover:bg-muted/50',
                    'transition-all duration-200 ease-in-out'
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
                        'bg-transparent hover:bg-primary/20 transition-all duration-200',
                        'before:absolute before:left-1/2 before:top-0 before:h-full before:w-0.5',
                        'before:bg-border before:transform before:-translate-x-1/2',
                        'hover:before:bg-primary/60 hover:w-3',
                        header.column.getIsResizing() && 'bg-primary/30 w-3 before:bg-primary'
                      )}
                      style={{
                        transform: 'translateX(50%)',
                      }}
                      title={`Resize ${header.column.columnDef.header} column`}
                    />
                  )}
                </th>
              </HeaderContextMenu>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
