import { X, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDataGrid } from './context';
import { DataGridAction } from './types';

export function DataGridActionDock() {
  const { selectedRows, actions, table } = useDataGrid();

  if (selectedRows.length === 0 || actions.length === 0) {
    return null;
  }

  // Filter actions based on visibility and enablement
  const visibleActions = actions.filter((action) => (action.isVisible ? action.isVisible(selectedRows) : true));

  const primaryActions = visibleActions.slice(0, 3); // Show first 3 actions as dock items
  const overflowActions = visibleActions.slice(3); // Rest go in dropdown

  const handleActionClick = async (action: DataGridAction<any>) => {
    try {
      await action.onClick(selectedRows);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const clearSelection = () => {
    table.resetRowSelection();
  };

  return (
    <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300'>
      <div className='flex items-center gap-3 px-4 py-3 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg shadow-black/10 dark:shadow-black/20'>
        <Button variant='outline' size='sm' onClick={clearSelection} aria-label='Clear selection'>
          {selectedRows.length} selected <X className='h-4 w-4' />
        </Button>

        {/* Dock Separator */}
        <div className='w-px h-6 bg-border/50 mx-1' />

        {/* Primary Actions */}
        <div className='flex items-center gap-2'>
          {primaryActions.map((action) => {
            const isEnabled = action.isEnabled ? action.isEnabled(selectedRows) : true;

            return (
              <Button
                key={action.id}
                variant={action.variant || 'default'}
                size='sm'
                onClick={() => handleActionClick(action)}
                disabled={!isEnabled}>
                {action.icon && <span className='h-4 w-4'>{action.icon}</span>}
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Overflow Actions */}
        {overflowActions.length > 0 && (
          <>
            <div className='w-px h-6 bg-border/50 mx-1' />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  <MoreHorizontal className='h-4 w-4' />
                  <span>More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='center' side='top' sideOffset={8}>
                {overflowActions.map((action) => {
                  const isEnabled = action.isEnabled ? action.isEnabled(selectedRows) : true;

                  return (
                    <DropdownMenuItem key={action.id} onClick={() => handleActionClick(action)} disabled={!isEnabled}>
                      {action.icon && <span className='h-4 w-4'>{action.icon}</span>}
                      <span>{action.label}</span>
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
