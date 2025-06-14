'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CellEditComponentProps, EditBehaviors } from './types';

// Text Input Component with flexible behavior
export function TextEditInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  onExit,
  config,
  isSaving,
  error,
  placeholder,
  disabled,
  autoFocus = true,
  selectAllOnFocus = true,
}: CellEditComponentProps<TData, string>) {
  const [inputValue, setInputValue] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement>(null);

  const behavior = config.behavior || EditBehaviors.clickToEdit;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      if (selectAllOnFocus) {
        inputRef.current.select();
      }
    }
  }, [autoFocus, selectAllOnFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && behavior.saveOn?.includes('enter')) {
      e.preventDefault();
      onChange(inputValue);
      onSave();
    } else if (e.key === 'Escape' && behavior.cancelOn?.includes('escape')) {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    if (behavior.saveOn?.includes('blur')) {
      onChange(inputValue);
      onSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    if (behavior.saveOn?.includes('immediate')) {
      onSave();
    }
  };

  return (
    <div className="flex items-center gap-1 w-full relative">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled || isSaving}
        className={cn(
          "h-8 text-sm border-primary",
          error && "border-destructive",
          isSaving && "opacity-50"
        )}
        autoFocus={autoFocus}
      />

      {behavior.showActionButtons && (
        <div className="flex items-center gap-1 ml-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => {
              onChange(inputValue);
              onSave();
            }}
            disabled={isSaving}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={onCancel}
            disabled={isSaving}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 z-10 mt-1 p-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

// Number Input Component
export function NumberEditInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder,
  disabled,
  autoFocus = true,
}: CellEditComponentProps<TData, number>) {
  const [inputValue, setInputValue] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const numValue = parseFloat(inputValue);
      onChange(isNaN(numValue) ? 0 : numValue);
      onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    const numValue = parseFloat(inputValue);
    onChange(isNaN(numValue) ? 0 : numValue);
    onSave();
  };

  return (
    <Input
      ref={inputRef}
      type="number"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className="h-8 text-sm border-primary"
      autoFocus={autoFocus}
    />
  );
}

// Select/Dropdown Component
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

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
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
      disabled={disabled}
    >
      <SelectTrigger 
        className="h-8 text-sm border-primary"
        onKeyDown={handleKeyDown}
        autoFocus
      >
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

// Checkbox Component
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
    <div className="flex items-center justify-center h-8">
      <Checkbox
        checked={Boolean(value)}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        className="border-primary"
      />
    </div>
  );
}

// Date Input Component
export function DateEditInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder,
  disabled,
  autoFocus = true,
}: CellEditComponentProps<TData, string>) {
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onChange(inputValue);
      onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    onChange(inputValue);
    onSave();
  };

  return (
    <Input
      ref={inputRef}
      type="date"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className="h-8 text-sm border-primary"
      autoFocus={autoFocus}
    />
  );
}

// Email Input Component
export function EmailEditInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder,
  disabled,
  autoFocus = true,
}: CellEditComponentProps<TData, string>) {
  const [inputValue, setInputValue] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onChange(inputValue);
      onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    onChange(inputValue);
    onSave();
  };

  return (
    <Input
      ref={inputRef}
      type="email"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className="h-8 text-sm border-primary"
      autoFocus={autoFocus}
    />
  );
}

// Utility function to create a select component with predefined options
export function createSelectEditComponent<TData>(options: SelectOption[]) {
  return function SelectComponent(props: CellEditComponentProps<TData, string>) {
    return <SelectEditInput {...props} options={options} />;
  };
}

// Utility function to create a number input with min/max validation
export function createNumberEditComponent<TData>(min?: number, max?: number) {
  return function NumberComponent(props: CellEditComponentProps<TData, number>) {
    const validate = (value: number) => {
      if (min !== undefined && value < min) return false;
      if (max !== undefined && value > max) return false;
      return true;
    };

    const handleChange = (value: number) => {
      if (validate(value)) {
        props.onChange(value);
      }
    };

    return <NumberEditInput {...props} onChange={handleChange} />;
  };
}
