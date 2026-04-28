'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { Column } from '@tanstack/react-table';
import { Filter, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';
import { ColumnFilterConfig, DataGridLabels } from './types';

interface ColumnFilterProps<TData> {
  column: Column<TData>;
  config: ColumnFilterConfig<TData>;
  labels: Required<DataGridLabels>;
}

export function ColumnFilter<TData>({ column, config, labels }: ColumnFilterProps<TData>) {
  const [open, setOpen] = useState(false);
  const isActive = column.getIsFiltered();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label={`${labels.filter} ${column.id}`}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted/70 transition-colors',
            isActive && 'text-primary'
          )}>
          <Filter className={cn('h-3.5 w-3.5', isActive && 'fill-current')} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-64 p-3'>
        <FilterBody column={column} config={config} labels={labels} onClose={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface FilterBodyProps<TData> {
  column: Column<TData>;
  config: ColumnFilterConfig<TData>;
  labels: Required<DataGridLabels>;
  onClose: () => void;
}

function FilterBody<TData>({ column, config, labels, onClose }: FilterBodyProps<TData>) {
  const value = column.getFilterValue();
  const setValue = (next: any) => column.setFilterValue(next);

  let body: ReactNode;

  if (config.render) {
    body = config.render(column, value, setValue);
  } else {
    switch (config.type) {
      case 'text':
        body = <TextFilter value={(value as string) ?? ''} setValue={setValue} placeholder={config.placeholder} />;
        break;
      case 'number':
        body = <NumberFilter value={value} setValue={setValue} placeholder={config.placeholder} />;
        break;
      case 'numberRange':
        body = <NumberRangeFilter value={value as [number?, number?]} setValue={setValue} />;
        break;
      case 'select':
        body = <SelectFilter options={config.options ?? []} value={value as string} setValue={setValue} />;
        break;
      case 'multiSelect':
        body = (
          <MultiSelectFilter options={config.options ?? []} value={(value as string[]) ?? []} setValue={setValue} />
        );
        break;
      case 'date':
        body = <DateFilter value={value as string} setValue={setValue} />;
        break;
      case 'dateRange':
        body = <DateRangeFilter value={value as [string?, string?]} setValue={setValue} />;
        break;
      case 'boolean':
        body = <BooleanFilter value={value as boolean | undefined} setValue={setValue} />;
        break;
      default:
        body = <TextFilter value={(value as string) ?? ''} setValue={setValue} />;
    }
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-medium text-muted-foreground'>{labels.filter}</span>
        <button
          type='button'
          onClick={() => {
            column.setFilterValue(undefined);
          }}
          className='text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1'>
          <X className='h-3 w-3' />
          {labels.clear}
        </button>
      </div>
      <div>{body}</div>
      <div className='flex justify-end pt-1'>
        <Button size='sm' className='h-7 px-3 text-xs' onClick={onClose}>
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}

function TextFilter({
  value,
  setValue,
  placeholder,
}: {
  value: string;
  setValue: (v: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <Input
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder ?? 'Contains...'}
      className='h-8 text-sm'
    />
  );
}

function NumberFilter({
  value,
  setValue,
  placeholder,
}: {
  value: any;
  setValue: (v: number | undefined) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <Input
      ref={ref}
      type='number'
      value={value ?? ''}
      onChange={(e) => {
        const v = e.target.value;
        setValue(v === '' ? undefined : Number(v));
      }}
      placeholder={placeholder ?? 'Equals...'}
      className='h-8 text-sm'
    />
  );
}

function NumberRangeFilter({
  value,
  setValue,
}: {
  value: [number?, number?] | undefined;
  setValue: (v: [number?, number?] | undefined) => void;
}) {
  const [min, max] = value ?? [undefined, undefined];
  const set = (i: 0 | 1, v: string) => {
    const num = v === '' ? undefined : Number(v);
    const next: [number?, number?] = i === 0 ? [num, max] : [min, num];
    if (next[0] === undefined && next[1] === undefined) setValue(undefined);
    else setValue(next);
  };
  return (
    <div className='flex items-center gap-2'>
      <Input
        type='number'
        value={min ?? ''}
        onChange={(e) => set(0, e.target.value)}
        placeholder='Min'
        className='h-8 text-sm'
      />
      <span className='text-muted-foreground text-xs'>–</span>
      <Input
        type='number'
        value={max ?? ''}
        onChange={(e) => set(1, e.target.value)}
        placeholder='Max'
        className='h-8 text-sm'
      />
    </div>
  );
}

function SelectFilter({
  options,
  value,
  setValue,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  setValue: (v: string | undefined) => void;
}) {
  return (
    <div className='max-h-56 overflow-y-auto -mx-1 px-1'>
      <button
        type='button'
        onClick={() => setValue(undefined)}
        className={cn(
          'w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent',
          !value && 'bg-accent/50 font-medium'
        )}>
        Any
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          type='button'
          onClick={() => setValue(opt.value)}
          className={cn(
            'w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent',
            value === opt.value && 'bg-accent/50 font-medium'
          )}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function MultiSelectFilter({
  options,
  value,
  setValue,
}: {
  options: { value: string; label: string }[];
  value: string[];
  setValue: (v: string[] | undefined) => void;
}) {
  const toggle = (v: string) => {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    setValue(next.length === 0 ? undefined : next);
  };
  return (
    <div className='max-h-56 overflow-y-auto -mx-1 px-1 space-y-0.5'>
      {options.map((opt) => (
        <label
          key={opt.value}
          className='flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer'>
          <Checkbox checked={value.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function DateFilter({ value, setValue }: { value: string | undefined; setValue: (v: string | undefined) => void }) {
  return (
    <Input
      type='date'
      value={value ?? ''}
      onChange={(e) => setValue(e.target.value || undefined)}
      className='h-8 text-sm'
    />
  );
}

function DateRangeFilter({
  value,
  setValue,
}: {
  value: [string?, string?] | undefined;
  setValue: (v: [string?, string?] | undefined) => void;
}) {
  const [from, to] = value ?? [undefined, undefined];
  const set = (i: 0 | 1, v: string) => {
    const val = v || undefined;
    const next: [string?, string?] = i === 0 ? [val, to] : [from, val];
    if (!next[0] && !next[1]) setValue(undefined);
    else setValue(next);
  };
  return (
    <div className='flex items-center gap-2'>
      <Input type='date' value={from ?? ''} onChange={(e) => set(0, e.target.value)} className='h-8 text-sm' />
      <span className='text-muted-foreground text-xs'>–</span>
      <Input type='date' value={to ?? ''} onChange={(e) => set(1, e.target.value)} className='h-8 text-sm' />
    </div>
  );
}

function BooleanFilter({
  value,
  setValue,
}: {
  value: boolean | undefined;
  setValue: (v: boolean | undefined) => void;
}) {
  return (
    <div className='flex flex-col gap-1'>
      <button
        type='button'
        onClick={() => setValue(undefined)}
        className={cn(
          'text-left px-2 py-1.5 text-sm rounded hover:bg-accent',
          value === undefined && 'bg-accent/50 font-medium'
        )}>
        Any
      </button>
      <button
        type='button'
        onClick={() => setValue(true)}
        className={cn(
          'text-left px-2 py-1.5 text-sm rounded hover:bg-accent',
          value === true && 'bg-accent/50 font-medium'
        )}>
        True
      </button>
      <button
        type='button'
        onClick={() => setValue(false)}
        className={cn(
          'text-left px-2 py-1.5 text-sm rounded hover:bg-accent',
          value === false && 'bg-accent/50 font-medium'
        )}>
        False
      </button>
    </div>
  );
}
