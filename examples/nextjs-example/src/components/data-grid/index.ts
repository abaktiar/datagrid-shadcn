// Main components
export { DataGrid } from './data-grid';
export { DataGridHeader } from './data-grid-header';
export { DataGridBody } from './data-grid-body';
export { DataGridPagination } from './data-grid-pagination';
export { DataGridFilters } from './data-grid-filters';
export { DataGridActionDock } from './data-grid-action-dock';
export { CellContextMenu, HeaderContextMenu } from './data-grid-context-menu';

// Editing components
export { EditableCell, DefaultTextInput } from './data-grid-editable-cell';
export {
  TextEditInput,
  NumberEditInput,
  SelectEditInput,
  CheckboxEditInput,
  DateEditInput,
  EmailEditInput,
  createSelectEditComponent,
  createNumberEditComponent,
} from './edit-components';

// Editing presets and utilities
export {
  EditPresets,
  BehaviorBuilder,
  createQuickEdit,
  createClickToEdit,
  createClickWithButtons,
  createDoubleClickToEdit,
} from './edit-presets';

// Context and hooks
export { useDataGrid } from './context';

// Types
export type {
  DataGridProps,
  DataGridColumn,
  DataGridAction,
  DataGridState,
  DataChangeParams,
  CellContextMenuItem,
  HeaderContextMenuItem,
  DataGridContextValue,
  CellEditConfig,
  CellEditComponentProps,
  CellEditMode,
  CellEditTrigger,
  CellEditBehavior,
  QuickEditConfig,
} from './types';

// Export EditBehaviors constant
export { EditBehaviors } from './types';

// Context menu utilities
export * from './context-menu-utils';
