import { ReactNode } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { Row, Column } from '@tanstack/react-table';
import { CellContextMenuItem, HeaderContextMenuItem } from './types';

interface CellContextMenuProps<TData> {
  children: ReactNode;
  row: Row<TData>;
  column: Column<TData>;
  value: any;
  items?: CellContextMenuItem<TData>[];
}

interface HeaderContextMenuProps<TData> {
  children: ReactNode;
  column: Column<TData>;
  items?: HeaderContextMenuItem<TData>[];
}

export function CellContextMenu<TData>({ children, row, column, value, items = [] }: CellContextMenuProps<TData>) {
  if (items.length === 0) {
    return <>{children}</>;
  }

  const visibleItems = items.filter((item) => (item.isVisible ? item.isVisible(row, column, value) : true));

  if (visibleItems.length === 0) {
    return <>{children}</>;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className='w-48'>
        {visibleItems.map((item) => {
          if (item.separator) {
            return <ContextMenuSeparator key={item.id} />;
          }

          const isEnabled = item.isEnabled ? item.isEnabled(row, column, value) : true;

          return (
            <ContextMenuItem
              key={item.id}
              onClick={() => item.onClick(row, column, value)}
              disabled={!isEnabled}
              className={`flex items-center gap-2 ${
                item.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''
              }`}>
              {item.icon && <span className='h-4 w-4'>{item.icon}</span>}
              <span>{item.label}</span>
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function HeaderContextMenu<TData>({ children, column, items = [] }: HeaderContextMenuProps<TData>) {
  if (items.length === 0) {
    return <>{children}</>;
  }

  const visibleItems = items.filter((item) => (item.isVisible ? item.isVisible(column) : true));

  if (visibleItems.length === 0) {
    return <>{children}</>;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className='w-48'>
        {visibleItems.map((item) => {
          if (item.separator) {
            return <ContextMenuSeparator key={item.id} />;
          }

          const isEnabled = item.isEnabled ? item.isEnabled(column) : true;

          return (
            <ContextMenuItem
              key={item.id}
              onClick={() => item.onClick(column)}
              disabled={!isEnabled}
              className={`flex items-center gap-2 ${
                item.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''
              }`}>
              {item.icon && <span className='h-4 w-4'>{item.icon}</span>}
              <span>{item.label}</span>
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
}
