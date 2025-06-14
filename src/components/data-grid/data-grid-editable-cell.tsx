'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Column } from '@tanstack/react-table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CellEditConfig, CellEditComponentProps, EditBehaviors } from './types';
import { useDataGrid } from './context';

interface EditableCellProps<TData> {
  row: Row<TData>;
  column: Column<TData>;
  value: any;
  editConfig: CellEditConfig<TData>;
}

// Default input component for text editing with full control
export function DefaultTextInput<TData>({
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
  };

  return (
    <div className='w-full relative'>
      {/* Input positioned at top of cell */}
      <div className='absolute top-0 left-0 right-0 z-20'>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || isSaving}
          className={cn(
            'h-8 text-sm border-primary shadow-md',
            error && 'border-destructive',
            isSaving && 'opacity-50'
          )}
          autoFocus={autoFocus}
        />
      </div>

      {/* Action buttons positioned at top-right or bottom-right */}
      {behavior.showActionButtons && (
        <div
          className={`absolute ${
            behavior.buttonPosition === 'bottom-right' ? 'top-9 right-0' : 'top-0 right-0'
          } z-30 bg-background border border-border rounded-md shadow-lg p-1 flex items-center gap-1`}>
          <Button
            size='sm'
            variant='ghost'
            className='h-7 w-7 p-0'
            onClick={() => {
              onChange(inputValue);
              onSave();
            }}
            disabled={isSaving}>
            <Check className='h-3 w-3' />
          </Button>
          <Button size='sm' variant='ghost' className='h-7 w-7 p-0' onClick={onCancel} disabled={isSaving}>
            <X className='h-3 w-3' />
          </Button>
        </div>
      )}

      {/* Error message positioned below input */}
      {error && (
        <div className='absolute top-9 left-0 right-0 z-30 p-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md shadow-lg'>
          {error}
        </div>
      )}
    </div>
  );
}

// Editable cell wrapper component with full developer control
export function EditableCell<TData>({
  row,
  column,
  value,
  editConfig
}: EditableCellProps<TData>) {
  const { editingCell, setEditingCell, onCellEdit, onCellEditError, defaultEditMode } = useDataGrid<TData>();
  const [currentValue, setCurrentValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get behavior configuration with defaults
  const behavior = editConfig.behavior || EditBehaviors.clickToEdit;
  const mode = behavior.mode || defaultEditMode;

  const isCurrentlyEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id;
  const isEditing = isCurrentlyEditing;

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Callbacks for the input component
  const handleChange = useCallback((newValue: any) => {
    setCurrentValue(newValue);
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    // Validate the value
    if (editConfig.validate) {
      const validationError = editConfig.validate(currentValue, row);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      // Call edit start callback
      editConfig.onEditStart?.(row, column);

      // Try column-specific onSave first, then global onCellEdit
      const saveHandler = editConfig.onSave || onCellEdit;

      if (saveHandler) {
        const success = await saveHandler(currentValue, row, column);
        if (!success) {
          setError('Failed to save changes');
          setIsSaving(false);
          return;
        }
      }

      // Update the row data optimistically
      const originalData = row.original as any;
      const accessorKey = (column as any).accessorKey;
      if (accessorKey) {
        originalData[accessorKey] = currentValue;
      }

      // Exit edit mode
      setEditingCell(null);

      // Call edit end callback
      editConfig.onEditEnd?.(row, column);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes';
      setError(errorMessage);
      onCellEditError?.(errorMessage, row, column);
    } finally {
      setIsSaving(false);
    }
  }, [currentValue, editConfig, row, column, onCellEdit, onCellEditError, isSaving, mode, setEditingCell]);

  const handleCancel = useCallback(() => {
    setCurrentValue(value); // Reset to original value
    setError(null);
    editConfig.onCancel?.(row, column);

    // Exit edit mode
    setEditingCell(null);
  }, [value, editConfig, row, column, mode, setEditingCell]);

  const handleExit = useCallback(() => {
    // Exit without saving or canceling
    setEditingCell(null);
    setError(null);
  }, [setEditingCell]);

  const startEditing = useCallback(() => {
    if (editConfig.disabled?.(row)) return;

    setEditingCell({ rowId: row.id, columnId: column.id });
    setError(null);
    editConfig.onEditStart?.(row, column);
  }, [editConfig, row, column, setEditingCell]);

  const handleClick = useCallback(() => {
    if (mode === 'click' && !isEditing) {
      startEditing();
    }
  }, [mode, isEditing, startEditing]);

  const handleDoubleClick = useCallback(() => {
    if (mode === 'doubleClick' && !isEditing) {
      startEditing();
    }
  }, [mode, isEditing, startEditing]);

  // Render edit component
  if (isEditing) {
    const EditComponent = editConfig.component || DefaultTextInput;

    return (
      <div className='relative w-full h-full min-h-[32px]'>
        <EditComponent
          value={currentValue}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={handleCancel}
          onExit={handleExit}
          row={row}
          column={column}
          config={editConfig}
          isSaving={isSaving}
          error={error}
          placeholder={editConfig.placeholder}
          disabled={editConfig.disabled?.(row)}
          autoFocus={behavior.autoFocus}
          selectAllOnFocus={behavior.selectAllOnFocus}
        />
      </div>
    );
  }

  // Render display value
  return (
    <div
      className={cn(
        "w-full h-full flex items-center",
        mode === 'click' && "cursor-pointer hover:bg-muted/50",
        mode === 'doubleClick' && "cursor-pointer hover:bg-muted/50",
        editConfig.disabled?.(row) && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title={
        mode === 'click' ? 'Click to edit' :
        mode === 'doubleClick' ? 'Double-click to edit' :
        undefined
      }
    >
      {String(currentValue || '')}
    </div>
  );
}
