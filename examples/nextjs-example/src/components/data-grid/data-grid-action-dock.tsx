import { X, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
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
    <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50'>
      <div className='flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-md shadow-md'>
        <Button variant='ghost' size='sm' onClick={clearSelection} aria-label='Clear selection' className='h-8 px-2'>
          {selectedRows.length} selected <X className='h-3 w-3 ml-1' />
        </Button>

        {/* Dock Separator */}
        <div className='w-px h-4 bg-border' />

        {/* Primary Actions */}
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

        {/* Overflow Actions */}
        {overflowActions.length > 0 && (
          <>
            <div className='w-px h-4 bg-border' />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 px-2'>
                  <MoreHorizontal className='h-3 w-3 mr-1' />
                  <span className='text-xs'>More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='center' side='top' sideOffset={4}>
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
