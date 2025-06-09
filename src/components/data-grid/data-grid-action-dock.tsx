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
import { cn } from '@/lib/utils';

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
    <div className='absolute -top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300'>
      <div className='flex items-center gap-1 px-3 py-2 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg shadow-black/10 dark:shadow-black/20'>
        {/* Selection Info */}
        <div className='flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-xl'>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-primary animate-pulse' />
            <span className='text-xs font-medium text-muted-foreground'>{selectedRows.length}</span>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={clearSelection}
            className='h-5 w-5 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full'
            aria-label='Clear selection'>
            <X className='h-3 w-3' />
          </Button>
        </div>

        {/* Dock Separator */}
        <div className='w-px h-6 bg-border/50 mx-1' />

        {/* Primary Actions */}
        <div className='flex items-center gap-1'>
          {primaryActions.map((action) => {
            const isEnabled = action.isEnabled ? action.isEnabled(selectedRows) : true;

            return (
              <Button
                key={action.id}
                variant='ghost'
                size='sm'
                onClick={() => handleActionClick(action)}
                disabled={!isEnabled}
                className={cn(
                  'h-9 w-9 p-0 rounded-xl hover:bg-muted/80 transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  action.variant === 'destructive' && 'hover:bg-destructive/20 hover:text-destructive',
                  !isEnabled && 'opacity-50 cursor-not-allowed'
                )}
                title={action.label}
                aria-label={action.label}>
                {action.icon && <span className='h-4 w-4'>{action.icon}</span>}
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
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-9 w-9 p-0 rounded-xl hover:bg-muted/80 transition-all duration-200 hover:scale-105 active:scale-95'
                  title='More actions'
                  aria-label='More actions'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='center'
                side='top'
                className='mb-2 min-w-[160px] rounded-xl border-border/50 bg-background/95 backdrop-blur-md'
                sideOffset={8}>
                {overflowActions.map((action) => {
                  const isEnabled = action.isEnabled ? action.isEnabled(selectedRows) : true;

                  return (
                    <DropdownMenuItem
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      disabled={!isEnabled}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer',
                        action.variant === 'destructive' &&
                          'text-destructive focus:text-destructive focus:bg-destructive/10'
                      )}>
                      {action.icon && <span className='h-4 w-4'>{action.icon}</span>}
                      <span className='text-sm'>{action.label}</span>
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
