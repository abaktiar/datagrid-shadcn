'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Cell, flexRender, Row } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../lib/utils';
import { useDataGrid } from './context';
import { CellContextMenu } from './data-grid-context-menu';
import { EditableCell } from './data-grid-editable-cell';
import {
  CellEditConfig,
  CellRange,
  DataGridDensity,
  getPinningStyles,
  isInteractiveTarget,
  isMetaColumn,
  META_COLUMN_IDS,
  normalizeCellRange,
} from './types';

interface DataGridBodyProps {
  enableVirtualization?: boolean;
  estimateSize?: number;
}

const densityRowPaddingY: Record<DataGridDensity, string> = {
  compact: 'py-0.5',
  normal: 'py-1.5',
  comfortable: 'py-3',
};

export function DataGridBody({ enableVirtualization = false, estimateSize = 35 }: DataGridBodyProps) {
  const {
    table,
    isLoading,
    error,
    cellContextMenuItems,
    enableCellContextMenu,
    enableCellEditing,
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
    density,
    loadingRowCount,
    emptyState,
    loadingState,
    errorState,
    labels,
    setEditingCell,
  } = useDataGrid();

  const tableContainerRef = useRef<HTMLTableSectionElement>(null);
  const rangeAnchorRef = useRef<{ rowIndex: number; colIndex: number } | null>(null);
  const isMouseDownRef = useRef(false);

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const dataColumns = useMemo(
    () => visibleColumns.filter((c) => !isMetaColumn(c.id)),
    [visibleColumns]
  );

  const colSpan = visibleColumns.length;

  const colIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    dataColumns.forEach((c, i) => map.set(c.id, i));
    return map;
  }, [dataColumns]);

  const colIndexById = useCallback((id: string) => colIndexMap.get(id) ?? -1, [colIndexMap]);

  // ---------------- Cell rendering ----------------

  const renderCellContent = (cell: Cell<any, unknown>) => {
    const column = cell.column;
    const row = cell.row;
    const value = cell.getValue();

    const columnDef = column.columnDef as any;
    const editConfig = columnDef.enableEditing;

    if (enableCellEditing && editConfig) {
      const config: CellEditConfig<any> =
        typeof editConfig === 'boolean' ? { enabled: true } : { enabled: true, ...editConfig };
      // Pre-render display content via flexRender (full TanStack context)
      const display = column.columnDef.cell
        ? flexRender(column.columnDef.cell, cell.getContext())
        : undefined;
      return (
        <EditableCell
          row={row}
          column={column}
          value={value}
          editConfig={config}
          displayContent={display}
        />
      );
    }

    return flexRender(column.columnDef.cell, cell.getContext());
  };

  // ---------------- Mouse range selection ----------------

  const beginRange = useCallback(
    (rowIndex: number, colIndex: number, extend: boolean) => {
      if (!enableCellSelection) return;
      if (!extend || !rangeAnchorRef.current) {
        rangeAnchorRef.current = { rowIndex, colIndex };
        setCellRange({
          startRowIndex: rowIndex,
          endRowIndex: rowIndex,
          startColIndex: colIndex,
          endColIndex: colIndex,
        });
      } else {
        const a = rangeAnchorRef.current;
        setCellRange({
          startRowIndex: a.rowIndex,
          endRowIndex: rowIndex,
          startColIndex: a.colIndex,
          endColIndex: colIndex,
        });
      }
    },
    [enableCellSelection, setCellRange]
  );

  const extendRange = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!enableCellSelection || !rangeAnchorRef.current) return;
      const a = rangeAnchorRef.current;
      setCellRange({
        startRowIndex: a.rowIndex,
        endRowIndex: rowIndex,
        startColIndex: a.colIndex,
        endColIndex: colIndex,
      });
    },
    [enableCellSelection, setCellRange]
  );

  const cellInRange = (rowIndex: number, colIndex: number, range: CellRange | null) => {
    if (!range) return false;
    const { r1, r2, c1, c2 } = normalizeCellRange(range);
    return rowIndex >= r1 && rowIndex <= r2 && colIndex >= c1 && colIndex <= c2;
  };

  // ---------------- Keyboard navigation ----------------

  const moveFocus = useCallback(
    (deltaRow: number, deltaCol: number, e: React.KeyboardEvent) => {
      if (!enableKeyboardNavigation || dataColumns.length === 0 || rows.length === 0) return;
      e.preventDefault();
      let rIdx = 0;
      let cIdx = 0;
      if (focusedCell) {
        const r = rows.findIndex((row) => row.id === focusedCell.rowId);
        const c = colIndexById(focusedCell.columnId);
        rIdx = r >= 0 ? r : 0;
        cIdx = c >= 0 ? c : 0;
      }
      const nextR = Math.max(0, Math.min(rows.length - 1, rIdx + deltaRow));
      const nextC = Math.max(0, Math.min(dataColumns.length - 1, cIdx + deltaCol));
      const nextRow = rows[nextR];
      const nextCol = dataColumns[nextC];
      setFocusedCell({ rowId: nextRow.id, columnId: nextCol.id });
      if (e.shiftKey && enableCellSelection) {
        if (!rangeAnchorRef.current) rangeAnchorRef.current = { rowIndex: rIdx, colIndex: cIdx };
        extendRange(nextR, nextC);
      } else {
        rangeAnchorRef.current = null;
        setCellRange(null);
      }
    },
    [
      enableKeyboardNavigation,
      enableCellSelection,
      dataColumns,
      rows,
      focusedCell,
      colIndexById,
      setFocusedCell,
      extendRange,
      setCellRange,
    ]
  );

  const handleCellKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      if (!enableKeyboardNavigation) return;
      const row = rows[rowIndex];
      const col = dataColumns[colIndex];
      if (!row || !col) return;

      switch (e.key) {
        case 'ArrowDown':
          moveFocus(1, 0, e);
          return;
        case 'ArrowUp':
          moveFocus(-1, 0, e);
          return;
        case 'ArrowRight':
          moveFocus(0, 1, e);
          return;
        case 'ArrowLeft':
          moveFocus(0, -1, e);
          return;
        case 'Home':
          if (e.ctrlKey || e.metaKey) moveFocus(-rowIndex, -colIndex, e);
          else moveFocus(0, -colIndex, e);
          return;
        case 'End':
          if (e.ctrlKey || e.metaKey)
            moveFocus(rows.length - 1 - rowIndex, dataColumns.length - 1 - colIndex, e);
          else moveFocus(0, dataColumns.length - 1 - colIndex, e);
          return;
        case 'PageDown':
          moveFocus(10, 0, e);
          return;
        case 'PageUp':
          moveFocus(-10, 0, e);
          return;
        case ' ':
          if (table.options.enableRowSelection) {
            e.preventDefault();
            row.toggleSelected();
          }
          return;
        case 'Enter':
        case 'F2': {
          const editCfg = (col.columnDef as any).enableEditing;
          if (enableCellEditing && editCfg) {
            e.preventDefault();
            setEditingCell({ rowId: row.id, columnId: col.id });
          }
          return;
        }
        default:
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
            if (table.options.enableRowSelection) {
              e.preventDefault();
              table.toggleAllRowsSelected(true);
            }
            return;
          }
      }
    },
    [enableKeyboardNavigation, rows, dataColumns, moveFocus, table, enableCellEditing, setEditingCell]
  );

  // ---------------- Row click handlers ----------------

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, row: Row<any>) => {
    if (isInteractiveTarget(e.target)) return;
    onRowClick?.(row, e);
  };
  const handleRowDoubleClick = (e: React.MouseEvent<HTMLTableRowElement>, row: Row<any>) => {
    if (isInteractiveTarget(e.target)) return;
    onRowDoubleClick?.(row, e);
  };

  // Row expansion + virtualization don't compose: expanded <tr>s aren't tracked in the
  // virtualizer's item count or measured into total size, so detail panels would either
  // overlap absolute rows or sit outside the scroll height.
  const effectiveVirtualization = enableVirtualization && !enableRowExpansion;

  const warnedExpansionConflictRef = useRef(false);
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      enableVirtualization &&
      enableRowExpansion &&
      !warnedExpansionConflictRef.current
    ) {
      warnedExpansionConflictRef.current = true;
      // eslint-disable-next-line no-console
      console.warn(
        '[DataGrid] `enableVirtualization` is ignored when `enableRowExpansion` is enabled. ' +
          'Expanded detail rows are not yet measured by the row virtualizer; falling back to standard rendering.'
      );
    }
  }, [enableVirtualization, enableRowExpansion]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimateSize,
    enabled: effectiveVirtualization && rows.length > 50,
  });

  // ---------------- Loading / error / empty states ----------------

  if (isLoading) {
    if (loadingState) {
      return (
        <tbody ref={tableContainerRef}>
          <tr>
            <td colSpan={colSpan} className='p-0'>
              {typeof loadingState === 'function' ? loadingState() : loadingState}
            </td>
          </tr>
        </tbody>
      );
    }
    // Default skeleton rows
    return (
      <tbody ref={tableContainerRef}>
        {Array.from({ length: loadingRowCount }).map((_, i) => (
          <tr key={`skeleton-${i}`} className='border-b border-border'>
            {visibleColumns.map((col) => (
              <td
                key={col.id}
                className={cn('px-3 align-middle text-sm border-r border-border/50', densityRowPaddingY[density])}>
                <div className='h-3.5 w-3/4 rounded bg-muted animate-pulse' />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  if (error) {
    return (
      <tbody ref={tableContainerRef}>
        <tr>
          <td colSpan={colSpan} className='h-24 text-center text-destructive'>
            {errorState
              ? typeof errorState === 'function'
                ? errorState(error)
                : errorState
              : labels.error(error)}
          </td>
        </tr>
      </tbody>
    );
  }

  if (rows.length === 0) {
    return (
      <tbody ref={tableContainerRef}>
        <tr>
          <td colSpan={colSpan} className='h-24 text-center text-muted-foreground'>
            {emptyState ? (typeof emptyState === 'function' ? emptyState() : emptyState) : labels.noData}
          </td>
        </tr>
      </tbody>
    );
  }

  const renderRow = (row: Row<any>, rowIndex: number, virtualStyle?: React.CSSProperties) => {
    const isSelected = row.getIsSelected();
    const isExpanded = enableRowExpansion && row.getIsExpanded();
    const customClass = typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;

    return (
      <React.Fragment key={row.id}>
        <tr
          role='row'
          aria-rowindex={rowIndex + 2}
          aria-selected={isSelected}
          onClick={(e) => handleRowClick(e, row)}
          onDoubleClick={(e) => handleRowDoubleClick(e, row)}
          className={cn(
            'border-b border-border hover:bg-muted/50 transition-colors',
            isSelected && 'bg-accent/40 hover:bg-accent/40',
            (onRowClick || onRowDoubleClick) && 'cursor-pointer',
            customClass
          )}
          data-state={isSelected ? 'selected' : ''}
          style={virtualStyle}>
          {row.getVisibleCells().map((cell) => {
            const isDataCell = !isMetaColumn(cell.column.id);
            const colIndex = isDataCell ? colIndexById(cell.column.id) : -1;
            const isFocused =
              isDataCell && focusedCell?.rowId === row.id && focusedCell?.columnId === cell.column.id;
            const inRange = isDataCell && cellInRange(rowIndex, colIndex, cellRange);

            const tdContent = (
              <td
                role='gridcell'
                tabIndex={isDataCell && enableKeyboardNavigation ? (isFocused ? 0 : -1) : undefined}
                onFocus={() => {
                  if (isDataCell) setFocusedCell({ rowId: row.id, columnId: cell.column.id });
                }}
                onMouseDown={(e) => {
                  if (!isDataCell) return;
                  if (e.button !== 0) return;
                  isMouseDownRef.current = true;
                  beginRange(rowIndex, colIndex, e.shiftKey);
                  if (isDataCell && enableKeyboardNavigation) {
                    setFocusedCell({ rowId: row.id, columnId: cell.column.id });
                  }
                }}
                onMouseEnter={() => {
                  if (isMouseDownRef.current && isDataCell) extendRange(rowIndex, colIndex);
                }}
                onMouseUp={() => {
                  isMouseDownRef.current = false;
                }}
                onKeyDown={(e) => {
                  if (isDataCell) handleCellKeyDown(e, rowIndex, colIndex);
                }}
                className={cn(
                  'px-3 align-middle text-sm tabular-nums border-r border-border/50 [&:has([role=checkbox])]:pr-0 outline-none',
                  densityRowPaddingY[density],
                  cell.column.id === META_COLUMN_IDS.select && 'w-12 border-r-0',
                  cell.column.id === META_COLUMN_IDS.expand && 'w-9 border-r-0',
                  'has-[[data-editable-cell=true]]:hover:bg-muted/40 has-[[data-editable-cell=true]]:cursor-pointer',
                  inRange && 'bg-primary/10',
                  isFocused && enableKeyboardNavigation && 'ring-1 ring-primary/60 ring-inset'
                )}
                style={{
                  width: cell.column.getSize(),
                  minWidth: cell.column.columnDef.minSize ?? 50,
                  maxWidth: cell.column.columnDef.maxSize ?? 500,
                  ...getPinningStyles(cell.column, 1, 'var(--background)'),
                }}>
                {renderCellContent(cell)}
              </td>
            );

            if (enableCellContextMenu) {
              return (
                <CellContextMenu
                  key={cell.id}
                  row={row}
                  column={cell.column}
                  value={cell.getValue()}
                  items={cellContextMenuItems}>
                  {tdContent}
                </CellContextMenu>
              );
            }
            return <React.Fragment key={cell.id}>{tdContent}</React.Fragment>;
          })}
        </tr>

        {isExpanded && renderExpandedRow && (
          <tr key={`${row.id}-expanded`} className='border-b border-border bg-muted/20'>
            <td colSpan={colSpan} className='p-4'>
              {renderExpandedRow(row)}
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const virtualItems = effectiveVirtualization ? rowVirtualizer.getVirtualItems() : [];
  if (virtualItems.length > 0) {
    return (
      <tbody
        ref={tableContainerRef}
        style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}
        onMouseUp={() => {
          isMouseDownRef.current = false;
        }}>
        {virtualItems.map((virtualItem) =>
          renderRow(rows[virtualItem.index], virtualItem.index, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualItem.size}px`,
            transform: `translateY(${virtualItem.start}px)`,
          })
        )}
      </tbody>
    );
  }

  return (
    <tbody
      ref={tableContainerRef}
      onMouseUp={() => {
        isMouseDownRef.current = false;
      }}>
      {rows.map((row, idx) => renderRow(row, idx))}
    </tbody>
  );
}
