import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  PaginationState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { DataGridDensity } from './types';

export interface PersistedState {
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  globalFilter?: string;
  columnVisibility?: VisibilityState;
  columnSizing?: ColumnSizingState;
  columnPinning?: ColumnPinningState;
  columnOrder?: ColumnOrderState;
  pagination?: PaginationState;
  density?: DataGridDensity;
}

export type PersistKey = keyof PersistedState;

export interface UseGridPersistenceOptions {
  storageKey: string;
  include?: PersistKey[];
  storage?: Storage;
  /** Debounce window for storage writes in ms. Defaults to 150 — column resizing fires rapidly. */
  writeDebounceMs?: number;
}

const DEFAULT_KEYS: PersistKey[] = [
  'sorting',
  'columnFilters',
  'columnVisibility',
  'columnSizing',
  'columnPinning',
  'columnOrder',
  'density',
];

function readStorage(storage: Storage, key: string): PersistedState {
  try {
    const raw = storage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw) as PersistedState;
  } catch {
    return {};
  }
}

function writeStorage(storage: Storage, key: string, value: PersistedState) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization errors
  }
}

/**
 * Returns controlled props that you spread into <DataGrid />. Persists to localStorage
 * (or any Storage). Only the keys in `include` are tracked.
 */
const CALLBACK_BY_KEY: Record<PersistKey, string> = {
  sorting: 'onSortingChange',
  columnFilters: 'onColumnFiltersChange',
  globalFilter: 'onGlobalFilterChange',
  columnVisibility: 'onColumnVisibilityChange',
  columnSizing: 'onColumnSizingChange',
  columnPinning: 'onColumnPinningChange',
  columnOrder: 'onColumnOrderChange',
  pagination: 'onPaginationChange',
  density: 'onDensityChange',
};

export function useGridPersistence(options: UseGridPersistenceOptions) {
  const storage = options.storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
  const include = options.include ?? DEFAULT_KEYS;
  const writeDebounceMs = options.writeDebounceMs ?? 150;

  const [state, setState] = useState<PersistedState>(() => {
    if (!storage) return {};
    const saved = readStorage(storage, options.storageKey);
    const filtered: PersistedState = {};
    for (const key of include) {
      if (key in saved) (filtered as any)[key] = (saved as any)[key];
    }
    return filtered;
  });

  // Skip the first effect: the initial state was just read from storage, no need to write it back.
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!storage) return;
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const handle = window.setTimeout(() => {
      writeStorage(storage, options.storageKey, state);
    }, writeDebounceMs);
    return () => window.clearTimeout(handle);
  }, [state, storage, options.storageKey, writeDebounceMs]);

  // Stable update — `include` may be a fresh array each render, so capture it in a ref.
  const includeRef = useRef(include);
  includeRef.current = include;
  const update = useCallback(<K extends PersistKey>(key: K, value: PersistedState[K]) => {
    if (!includeRef.current.includes(key)) return;
    setState((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setState({}), []);

  const controlledProps = useMemo(() => {
    const props: Record<string, any> = {};
    for (const key of include) {
      if (state[key] !== undefined) props[key] = state[key];
      props[CALLBACK_BY_KEY[key]] = (next: any) => update(key, next);
    }
    return props;
  }, [state, include, update]);

  return { state, controlledProps, reset, update };
}
