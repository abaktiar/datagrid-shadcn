'use client';

import { X, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDataGrid } from './context';
import { DataGridAction, DockOptions } from './types';
import { cn } from '../../lib/utils';

interface DataGridActionDockProps {
  dockOptions?: DockOptions;
}

export function DataGridActionDock({ dockOptions }: DataGridActionDockProps) {
  const { selectedRows, actions, table, labels } = useDataGrid();

  if (selectedRows.length === 0 || actions.length === 0) return null;

  const primaryCount = dockOptions?.primaryActionCount ?? 3;
  const position = dockOptions?.position ?? 'bottom';

  const visibleActions = actions.filter((action) => (action.isVisible ? action.isVisible(selectedRows) : true));
  const primaryActions = visibleActions.slice(0, primaryCount);
  const overflowActions = visibleActions.slice(primaryCount);

  const handleActionClick = async (action: DataGridAction<any>) => {
    try {
      await action.onClick(selectedRows);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const clearSelection = () => table.resetRowSelection();

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-50',
        position === 'bottom' ? 'bottom-4' : 'top-4'
      )}>
      <div className='flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-md shadow-md'>
        <Button variant='ghost' size='sm' onClick={clearSelection} aria-label={labels.clearSelection} className='h-8 px-2'>
          {selectedRows.length} selected <X className='h-3 w-3 ml-1' />
        </Button>

        <div className='w-px h-4 bg-border' />

        <div className='flex items-center gap-1'>
          {primaryActions.map((action) => {
            const isEnabled = action.isEnabled ? action.isEnabled(selectedRows) : true;
            return (
              <Button
                key={action.id}
                variant={action.variant || 'default'}
                size='sm'
                onClick={() => handleActionClick(action)}
                disabled={!isEnabled}
                className='h-8 px-3'>
                {action.icon && <span className='h-3 w-3 mr-1'>{action.icon}</span>}
                <span className='text-xs'>{action.label}</span>
              </Button>
            );
          })}
        </div>

        {overflowActions.length > 0 && (
          <>
            <div className='w-px h-4 bg-border' />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 px-2'>
                  <MoreHorizontal className='h-3 w-3 mr-1' />
                  <span className='text-xs'>{labels.more}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='center' side={position === 'bottom' ? 'top' : 'bottom'} sideOffset={4}>
                {overflowActions.map((action) => {
                  const isEnabled = action.isEnabled ? action.isEnabled(selectedRows) : true;
                  return (
                    <DropdownMenuItem key={action.id} onClick={() => handleActionClick(action)} disabled={!isEnabled}>
                      {action.icon && <span className='h-3 w-3 mr-2'>{action.icon}</span>}
                      <span className='text-xs'>{action.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
}
