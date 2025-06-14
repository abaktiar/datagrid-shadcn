import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDataGrid } from './context'

interface DataGridPaginationProps {
  pageSizeOptions?: number[]
}

export function DataGridPagination({ 
  pageSizeOptions = [10, 20, 50, 100] 
}: DataGridPaginationProps) {
  const { table } = useDataGrid();

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;

  // Support both client-side and server-side pagination
  const isServerSide = table.options.manualPagination;
  const totalCount = (table.options.meta as any)?.totalCount;
  const totalRows = isServerSide && totalCount ? totalCount : table.getFilteredRowModel().rows.length;
  const startRow = table.getState().pagination.pageIndex * pageSize + 1;
  const endRow = Math.min(startRow + pageSize - 1, totalRows);

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex-1 text-sm text-muted-foreground'>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <span>
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </span>
        )}
      </div>

      <div className='flex items-center space-x-6 lg:space-x-8'>
        {/* Rows per page */}
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {currentPage} of {totalPages}
        </div>

        {/* Row range info */}
        <div className='text-sm text-muted-foreground'>
          {totalRows > 0 ? `${startRow}-${endRow} of ${totalRows}` : '0 of 0'}
        </div>

        {/* Navigation buttons */}
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label='Go to first page'>
            <ChevronsLeft className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label='Go to previous page'>
            <ChevronLeft className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label='Go to next page'>
            <ChevronRight className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label='Go to last page'>
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
