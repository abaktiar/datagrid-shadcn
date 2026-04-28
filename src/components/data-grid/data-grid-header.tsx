'use client';

import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDataGrid } from './context';
import { HeaderContextMenu } from './data-grid-context-menu';
import { ColumnFilter } from './column-filter';
import { getPinningStyles, isMetaColumn } from './types';

interface DataGridHeaderProps {
  stickyHeader?: boolean;
}

export function DataGridHeader({ stickyHeader = false }: DataGridHeaderProps) {
  const {
    table,
    headerContextMenuItems,
    enableHeaderContextMenu,
    enableColumnReordering,
    labels,
  } = useDataGrid();

  const [dragColId, setDragColId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    if (!enableColumnReordering) return;
    if (isMetaColumn(columnId)) return;
    setDragColId(columnId);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', columnId);
    } catch {
      // ignore
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!enableColumnReordering || !dragColId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    if (!enableColumnReordering || !dragColId) return;
    e.preventDefault();
    if (dragColId === targetColumnId) {
      setDragColId(null);
      return;
    }
    const order = table.getState().columnOrder.length
      ? [...table.getState().columnOrder]
      : table.getAllLeafColumns().map((c) => c.id);
    const fromIdx = order.indexOf(dragColId);
    const toIdx = order.indexOf(targetColumnId);
    if (fromIdx === -1 || toIdx === -1) {
      setDragColId(null);
      return;
    }
    order.splice(fromIdx, 1);
    order.splice(toIdx, 0, dragColId);
    table.setColumnOrder(order);
    setDragColId(null);
  };

  return (
    <thead
      className={cn(
        '[&_tr]:border-b bg-muted/30',
        stickyHeader && 'sticky top-0 z-10 backdrop-blur-sm bg-background/95'
      )}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} role='row'>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const sortDirection = header.column.getIsSorted();
            const filterConfig = (header.column.columnDef as any).filter;
            const showFilter = filterConfig && header.column.getCanFilter();
            const isDragSource = dragColId === header.column.id;
            const reorderable = enableColumnReordering && !isMetaColumn(header.column.id);
            const pinned = header.column.getIsPinned();

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
                draggable={reorderable}
                onDragStart={(e) => handleDragStart(e, header.column.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, header.column.id)}
                onDragEnd={() => setDragColId(null)}
                className={cn(
                  'h-10 px-3 text-left align-middle font-medium text-foreground text-sm relative border-r border-border/50 bg-muted/30',
                  '[&:has([role=checkbox])]:pr-0',
                  isMetaColumn(header.column.id) && 'border-r-0',
                  header.column.getIsResizing() && 'border-r-primary',
                  isDragSource && 'opacity-50',
                  pinned === 'left' && 'shadow-[2px_0_0_0_var(--border)]',
                  pinned === 'right' && 'shadow-[-2px_0_0_0_var(--border)]'
                )}
                style={{
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize ?? 50,
                  maxWidth: header.column.columnDef.maxSize ?? 500,
                  ...getPinningStyles(header.column, 2),
                }}>
                <div className='flex items-center gap-1.5'>
                  {reorderable && (
                    <span
                      className='cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground'
                      aria-hidden='true'>
                      <GripVertical className='h-3.5 w-3.5' />
                    </span>
                  )}

                  <button
                    type='button'
                    disabled={!canSort}
                    onClick={(e) => {
                      if (e.button !== 0) return;
                      const handler = header.column.getToggleSortingHandler();
                      if (handler) handler(e);
                    }}
                    onMouseDown={(e) => {
                      if (e.button !== 0) e.stopPropagation();
                    }}
                    className={cn(
                      'flex-1 flex items-center gap-1 text-left bg-transparent border-0 outline-none p-0 m-0',
                      canSort && 'cursor-pointer hover:text-foreground'
                    )}>
                    <span className='flex-1 truncate'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {canSort && (
                      <span className='inline-flex items-center'>
                        {sortDirection === 'asc' ? (
                          <ArrowUp className='h-3.5 w-3.5' />
                        ) : sortDirection === 'desc' ? (
                          <ArrowDown className='h-3.5 w-3.5' />
                        ) : (
                          <ArrowUpDown className='h-3.5 w-3.5 opacity-40' />
                        )}
                      </span>
                    )}
                  </button>

                  {showFilter && (
                    <ColumnFilter column={header.column} config={filterConfig} labels={labels} />
                  )}
                </div>

                {header.column.getCanResize() && (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={cn(
                      'absolute right-0 top-0 h-full w-2 cursor-col-resize select-none touch-none',
                      'before:absolute before:left-1/2 before:top-0 before:h-full before:w-px',
                      'before:bg-border/50 before:transform before:-translate-x-1/2 before:transition-colors',
                      'hover:before:bg-primary',
                      header.column.getIsResizing() && 'before:bg-primary'
                    )}
                    style={{ transform: 'translateX(50%)' }}
                    aria-hidden='true'
                  />
                )}
              </th>
            );

            return enableHeaderContextMenu && headerContextMenuItems ? (
              <HeaderContextMenu key={header.id} column={header.column} items={headerContextMenuItems}>
                {headerContent}
              </HeaderContextMenu>
            ) : (
              <React.Fragment key={header.id}>{headerContent}</React.Fragment>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

