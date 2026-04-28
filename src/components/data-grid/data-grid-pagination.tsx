'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDataGrid } from './context';

interface DataGridPaginationProps {
  pageSizeOptions?: number[];
}

export function DataGridPagination({ pageSizeOptions = [10, 20, 50, 100] }: DataGridPaginationProps) {
  const { table, labels } = useDataGrid();

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = Math.max(1, table.getPageCount());
  const pageSize = table.getState().pagination.pageSize;

  const isServerSide = table.options.manualPagination;
  const totalCount = (table.options.meta as any)?.totalCount;
  const totalRows = isServerSide && totalCount != null ? totalCount : table.getFilteredRowModel().rows.length;
  const startRow = totalRows === 0 ? 0 : table.getState().pagination.pageIndex * pageSize + 1;
  const endRow = Math.min(startRow + pageSize - 1, totalRows);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className='flex items-center justify-between px-2 flex-wrap gap-y-2'>
      <div className='flex-1 text-sm text-muted-foreground'>
        {selectedCount > 0 && <span>{labels.selected(selectedCount, totalRows)}</span>}
      </div>

      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>{labels.rowsPerPage}</p>
          <Select value={pageSize.toString()} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger className='h-8 w-[84px]'>
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

        <div className='flex w-[110px] items-center justify-center text-sm font-medium'>
          {labels.page(currentPage, totalPages)}
        </div>

        <div className='text-sm text-muted-foreground'>
          {totalRows > 0 ? labels.rowRange(startRow, endRow, totalRows) : '0 of 0'}
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label={labels.firstPage}>
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={labels.previousPage}>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={labels.nextPage}>
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label={labels.lastPage}>
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
