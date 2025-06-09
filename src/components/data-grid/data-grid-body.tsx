import { flexRender } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { useDataGrid } from './context'
import { CellContextMenu } from './data-grid-context-menu';

interface DataGridBodyProps {
  enableVirtualization?: boolean;
  estimateSize?: number;
}

export function DataGridBody({ enableVirtualization = false, estimateSize = 35 }: DataGridBodyProps) {
  const { table, isLoading, error } = useDataGrid();
  const tableContainerRef = useRef<HTMLTableSectionElement>(null);

  const rows = table.getRowModel().rows;

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
                'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
                row.getIsSelected() && 'bg-muted'
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
                  onEdit={(row) => {
                    console.log('Edit row:', row.original);
                  }}
                  onView={(row) => {
                    console.log('View row:', row.original);
                  }}
                  onDelete={(row) => {
                    console.log('Delete row:', row.original);
                  }}>
                  <td
                    role='gridcell'
                    className={cn(
                      'p-4 align-middle [&:has([role=checkbox])]:pr-0',
                      cell.column.id === 'select' && 'w-12'
                    )}
                    style={{
                      width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
                    }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
            'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
            row.getIsSelected() && 'bg-muted'
          )}>
          {row.getVisibleCells().map((cell) => (
            <CellContextMenu
              key={cell.id}
              row={row}
              column={cell.column}
              value={cell.getValue()}
              onEdit={(row) => {
                console.log('Edit row:', row.original);
              }}
              onView={(row) => {
                console.log('View row:', row.original);
              }}
              onDelete={(row) => {
                console.log('Delete row:', row.original);
              }}>
              <td
                role='gridcell'
                className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', cell.column.id === 'select' && 'w-12')}
                style={{
                  width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
                }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            </CellContextMenu>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
