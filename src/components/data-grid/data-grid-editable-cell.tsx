'use client';

import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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
  /** Pre-rendered display content from the body (uses column.cell with full TanStack context) */
  displayContent?: ReactNode;
}

// Default text input — used when no custom component is provided
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
  const [inputValue, setInputValue] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement>(null);

  const behavior = config.behavior || EditBehaviors.clickToEdit;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      if (selectAllOnFocus) inputRef.current.select();
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
    const next = e.target.value;
    setInputValue(next);
    onChange(next);
  };

  return (
    <div className='w-full relative'>
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

      {behavior.showActionButtons && (
        <div
          className={cn(
            'absolute z-30 bg-background border border-border rounded-md shadow-lg p-1 flex items-center gap-1',
            behavior.buttonPosition === 'bottom-right' ? 'top-9 right-0' : 'top-0 right-0'
          )}>
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

      {error && (
        <div className='absolute top-9 left-0 right-0 z-30 p-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md shadow-lg'>
          {error}
        </div>
      )}
    </div>
  );
}

export function EditableCell<TData>({ row, column, value, editConfig, displayContent }: EditableCellProps<TData>) {
  const {
    editingCell,
    setEditingCell,
    onCellEdit,
    onCellValueChange,
    onCellEditError,
    defaultEditMode,
  } = useDataGrid<TData>();

  const [draftValue, setDraftValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const cellRef = useRef<HTMLDivElement>(null);

  const behavior = editConfig.behavior || EditBehaviors.clickToEdit;
  const mode = behavior.mode || defaultEditMode;

  const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id;

  // Sync external value updates when not editing
  useEffect(() => {
    if (!isEditing) setDraftValue(value);
  }, [value, isEditing]);

  const handleChange = useCallback((next: any) => setDraftValue(next), []);

  const restoreFocus = useCallback(() => {
    // Defer until DOM updates so the read-mode container exists
    Promise.resolve().then(() => cellRef.current?.focus());
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    if (editConfig.validate) {
      const validationError = editConfig.validate(draftValue, row);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      const oldValue = value;

      // Column-specific save runs first if provided; otherwise the grid-level handler.
      const save = editConfig.onSave
        ? () => editConfig.onSave!(draftValue, row, column)
        : onCellEdit
        ? () => onCellEdit(draftValue, row, column, oldValue)
        : null;
      if (save) {
        const ok = await save();
        if (!ok) {
          setError('Failed to save changes');
          setIsSaving(false);
          return;
        }
      }

      // Notify consumer of the value change so they can update state immutably.
      // We deliberately do NOT mutate row.original here.
      onCellValueChange?.(row.id, column.id, oldValue, draftValue);

      setEditingCell(null);
      editConfig.onEditEnd?.(row, column);
      restoreFocus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes';
      setError(msg);
      onCellEditError?.(msg, row, column);
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving,
    editConfig,
    draftValue,
    row,
    column,
    value,
    onCellEdit,
    onCellValueChange,
    onCellEditError,
    setEditingCell,
    restoreFocus,
  ]);

  const handleCancel = useCallback(() => {
    setDraftValue(value);
    setError(null);
    editConfig.onCancel?.(row, column);
    setEditingCell(null);
    restoreFocus();
  }, [value, editConfig, row, column, setEditingCell, restoreFocus]);

  const handleExit = useCallback(() => {
    setEditingCell(null);
    setError(null);
    restoreFocus();
  }, [setEditingCell, restoreFocus]);

  const startEditing = useCallback(() => {
    if (editConfig.disabled?.(row)) return;
    setEditingCell({ rowId: row.id, columnId: column.id });
    setError(null);
    editConfig.onEditStart?.(row, column);
  }, [editConfig, row, column, setEditingCell]);

  const handleClick = useCallback(() => {
    if (mode === 'click' && !isEditing) startEditing();
  }, [mode, isEditing, startEditing]);

  const handleDoubleClick = useCallback(() => {
    if (mode === 'doubleClick' && !isEditing) startEditing();
  }, [mode, isEditing, startEditing]);

  if (isEditing) {
    const EditComponent = editConfig.component || DefaultTextInput;
    return (
      <div className='relative w-full h-full min-h-[32px]'>
        <EditComponent
          value={draftValue}
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

  // Display mode — use pre-rendered content from the body if provided, otherwise stringified value
  const content = displayContent !== undefined ? displayContent : String(value ?? '');
  const isDisabled = editConfig.disabled?.(row);

  return (
    <div
      ref={cellRef}
      tabIndex={-1}
      data-editable-cell={isDisabled ? 'disabled' : 'true'}
      className={cn(
        'w-full h-full flex items-center outline-none',
        !isDisabled && 'cursor-pointer',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}>
      {content}
    </div>
  );
}
