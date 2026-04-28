'use client';

import { Search, Settings2, Eye, EyeOff, Rows3, Download } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDataGrid } from './context';
import { DataGridDensity, isMetaColumn } from './types';
import { exportToCSV, exportToJSON } from './export-utils';
import { cn } from '../../lib/utils';

interface DataGridFiltersProps {
  enableGlobalFilter?: boolean;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  enableDensityToggle?: boolean;
  density: DataGridDensity;
  onDensityChange: (density: DataGridDensity) => void;
  enableExport?: boolean;
  exportFileName?: string;
}

export function DataGridFilters({
  enableGlobalFilter = true,
  globalFilter,
  onGlobalFilterChange,
  enableDensityToggle = false,
  density,
  onDensityChange,
  enableExport = false,
  exportFileName,
}: DataGridFiltersProps) {
  const { table, labels, selectedRows } = useDataGrid();
  const fileBase = exportFileName ?? 'data-grid-export';

  return (
    <div className='flex items-center justify-between gap-2 flex-wrap'>
      <div className='flex flex-1 items-center space-x-2 min-w-0'>
        {enableGlobalFilter && (
          <div className='relative max-w-sm w-full'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder={labels.search}
              value={globalFilter}
              onChange={(e) => onGlobalFilterChange(e.target.value)}
              className='pl-8'
              aria-label={labels.search}
            />
          </div>
        )}
      </div>

      <div className='flex items-center gap-2'>
        {enableDensityToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8' aria-label={labels.density}>
                <Rows3 className='mr-2 h-4 w-4' />
                {labels.density}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DensityItem current={density} value='compact' label={labels.densityCompact} onSelect={onDensityChange} />
              <DensityItem current={density} value='normal' label={labels.densityNormal} onSelect={onDensityChange} />
              <DensityItem
                current={density}
                value='comfortable'
                label={labels.densityComfortable}
                onSelect={onDensityChange}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {enableExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8' aria-label={labels.export}>
                <Download className='mr-2 h-4 w-4' />
                {labels.export}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[180px]'>
              <DropdownMenuItem onClick={() => exportToCSV(table, { fileName: `${fileBase}.csv` })}>
                {labels.exportCsv}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToJSON(table, { fileName: `${fileBase}.json` })}>
                {labels.exportJson}
              </DropdownMenuItem>
              {selectedRows.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      exportToCSV(table, { fileName: `${fileBase}-selected.csv`, selectedOnly: true })
                    }>
                    {labels.exportSelected} (CSV)
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='h-8' aria-label={labels.toggleColumns}>
              <Settings2 className='mr-2 h-4 w-4' />
              {labels.view}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[180px]'>
            <DropdownMenuLabel>{labels.toggleColumns}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllLeafColumns()
              .filter((column) => !isMetaColumn(column.id) && column.getCanHide())
              .map((column) => {
                const isVisible = column.getIsVisible();
                const headerLabel =
                  typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={isVisible}
                    onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}>
                    <div className='flex items-center space-x-2'>
                      {isVisible ? <Eye className='h-4 w-4' /> : <EyeOff className='h-4 w-4' />}
                      <span>{headerLabel}</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function DensityItem({
  current,
  value,
  label,
  onSelect,
}: {
  current: DataGridDensity;
  value: DataGridDensity;
  label: string;
  onSelect: (v: DataGridDensity) => void;
}) {
  return (
    <DropdownMenuItem onClick={() => onSelect(value)} className={cn(current === value && 'bg-accent/50 font-medium')}>
      {label}
    </DropdownMenuItem>
  );
}
