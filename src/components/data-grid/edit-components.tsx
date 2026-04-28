'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CellEditBehavior, CellEditComponentProps, EditBehaviors } from './types';

// Shared keyboard / blur behavior used by all standard edit inputs
function useEditBehavior(behavior: CellEditBehavior, cancel: () => void, changeAndCommit: () => void) {
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && behavior.saveOn?.includes('enter')) {
      e.preventDefault();
      changeAndCommit();
    } else if (e.key === 'Escape' && behavior.cancelOn?.includes('escape')) {
      e.preventDefault();
      cancel();
    }
  };

  const onBlur = () => {
    if (behavior.saveOn?.includes('blur')) {
      changeAndCommit();
    }
  };

  return { onKeyDown, onBlur };
}

// ---------------- Text ----------------
export function TextEditInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  config,
  isSaving,
  error,
  placeholder,
  disabled,
  autoFocus = true,
  selectAllOnFocus = true,
}: CellEditComponentProps<TData, string>) {
  const [inputValue, setInputValue] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement>(null);
  const behavior = config.behavior || EditBehaviors.clickToEdit;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      if (selectAllOnFocus) inputRef.current.select();
    }
  }, [autoFocus, selectAllOnFocus]);

  const commitImmediate = () => {
    onChange(inputValue);
    onSave();
  };

  const { onKeyDown, onBlur } = useEditBehavior(behavior, onCancel, commitImmediate);

  return (
    <div className='flex items-center gap-1 w-full relative'>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
          if (behavior.saveOn?.includes('immediate')) onSave();
        }}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled || isSaving}
        className={cn('h-8 text-sm border-primary', error && 'border-destructive', isSaving && 'opacity-50')}
        autoFocus={autoFocus}
      />

      {behavior.showActionButtons && (
        <div className='flex items-center gap-1 ml-1'>
          <Button size='sm' variant='ghost' className='h-6 w-6 p-0' onClick={commitImmediate} disabled={isSaving}>
            <Check className='h-3 w-3' />
          </Button>
          <Button size='sm' variant='ghost' className='h-6 w-6 p-0' onClick={onCancel} disabled={isSaving}>
            <X className='h-3 w-3' />
          </Button>
        </div>
      )}

      {error && (
        <div className='absolute top-full left-0 z-10 mt-1 p-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded'>
          {error}
        </div>
      )}
    </div>
  );
}

// ---------------- Number ----------------
export function NumberEditInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  config,
  placeholder,
  disabled,
  autoFocus = true,
}: CellEditComponentProps<TData, number>) {
  const [inputValue, setInputValue] = useState(value == null ? '' : String(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const behavior = config.behavior || EditBehaviors.clickToEdit;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const commitImmediate = () => {
    const num = parseFloat(inputValue);
    onChange(isNaN(num) ? 0 : num);
    onSave();
  };

  const { onKeyDown, onBlur } = useEditBehavior(behavior, onCancel, commitImmediate);

  return (
    <Input
      ref={inputRef}
      type='number'
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className='h-8 text-sm border-primary'
      autoFocus={autoFocus}
    />
  );
}

// ---------------- Select ----------------
interface SelectOption {
  value: string;
  label: string;
}

interface SelectEditInputProps<TData> extends CellEditComponentProps<TData, string> {
  options: SelectOption[];
}

export function SelectEditInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder,
  disabled,
  options,
}: SelectEditInputProps<TData>) {
  const [isOpen, setIsOpen] = useState(true);

  const handleValueChange = (newValue: string | null) => {
    onChange(newValue ?? '');
    onSave();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
      setIsOpen(false);
    }
  };

  return (
    <Select
      value={value || ''}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={disabled}>
      <SelectTrigger className='h-8 text-sm border-primary' onKeyDown={handleKeyDown} autoFocus>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ---------------- Checkbox ----------------
export function CheckboxEditInput<TData>({
  value,
  onChange,
  onSave,
  disabled,
}: CellEditComponentProps<TData, boolean>) {
  const handleCheckedChange = (checked: boolean) => {
    onChange(checked);
    onSave();
  };

  return (
    <div className='flex items-center justify-center h-8'>
      <Checkbox checked={Boolean(value)} onCheckedChange={handleCheckedChange} disabled={disabled} className='border-primary' />
    </div>
  );
}

// ---------------- Date ----------------
export function DateEditInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  config,
  placeholder,
  disabled,
  autoFocus = true,
}: CellEditComponentProps<TData, string>) {
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const behavior = config.behavior || EditBehaviors.clickToEdit;

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const commitImmediate = () => {
    onChange(inputValue);
    onSave();
  };

  const { onKeyDown, onBlur } = useEditBehavior(behavior, onCancel, commitImmediate);

  return (
    <Input
      ref={inputRef}
      type='date'
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className='h-8 text-sm border-primary'
      autoFocus={autoFocus}
    />
  );
}

// ---------------- Email ----------------
export function EmailEditInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  config,
  placeholder,
  disabled,
  autoFocus = true,
}: CellEditComponentProps<TData, string>) {
  const [inputValue, setInputValue] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement>(null);
  const behavior = config.behavior || EditBehaviors.clickToEdit;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const commitImmediate = () => {
    onChange(inputValue);
    onSave();
  };

  const { onKeyDown, onBlur } = useEditBehavior(behavior, onCancel, commitImmediate);

  return (
    <Input
      ref={inputRef}
      type='email'
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className='h-8 text-sm border-primary'
      autoFocus={autoFocus}
    />
  );
}

// ---------------- Helpers ----------------
export function createSelectEditComponent<TData>(options: SelectOption[]) {
  return function SelectComponent(props: CellEditComponentProps<TData, string>) {
    return <SelectEditInput {...props} options={options} />;
  };
}

export function createNumberEditComponent<TData>(min?: number, max?: number) {
  return function NumberComponent(props: CellEditComponentProps<TData, number>) {
    const handleChange = (next: number) => {
      if (min !== undefined && next < min) return;
      if (max !== undefined && next > max) return;
      props.onChange(next);
    };
    return <NumberEditInput {...props} onChange={handleChange} />;
  };
}
