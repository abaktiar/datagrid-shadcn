# DataGrid Context Menu Guide

## Overview

The DataGrid context menu system provides individual, granular utilities that developers can pick and choose from to create custom context menus for both cells and headers. This approach gives maximum flexibility while providing common utilities out of the box.

## Individual Cell Context Menu Items

### Copy Operations
```tsx
import { copyCellItem, copyRowItem } from './context-menu-utils';

// Copy individual cell value
copyCellItem<UserType>()

// Copy entire row as JSON
copyRowItem<UserType>()
```

### Edit Operations
```tsx
import { editCellItem } from './context-menu-utils';

// Basic edit (logs to console by default)
editCellItem<UserType>()

// Custom edit handler
editCellItem<UserType>((row, column, value) => {
  openEditDialog(row.original, column.id, value);
})
```

### Row Operations
```tsx
import { selectRowItem, deleteRowItem, viewRowDetailsItem } from './context-menu-utils';

// Toggle row selection
selectRowItem<UserType>()

// Delete row with custom handler
deleteRowItem<UserType>((row) => {
  if (confirm(`Delete ${row.original.name}?`)) {
    deleteUser(row.original.id);
  }
})

// View row details
viewRowDetailsItem<UserType>((row) => {
  navigate(`/users/${row.original.id}`);
})
```

## Individual Header Context Menu Items

### Sorting Operations
```tsx
import { sortAscendingItem, sortDescendingItem, clearSortItem } from './context-menu-utils';

// Sort ascending
sortAscendingItem<UserType>()

// Sort descending  
sortDescendingItem<UserType>()

// Clear sort
clearSortItem<UserType>()
```

### Filtering Operations
```tsx
import { filterColumnItem, clearFilterItem } from './context-menu-utils';

// Open filter dialog
filterColumnItem<UserType>((column) => {
  openFilterDialog(column.id);
})

// Clear filter
clearFilterItem<UserType>()
```

### Column Management
```tsx
import { 
  pinLeftItem, 
  pinRightItem, 
  unpinColumnItem,
  hideColumnItem,
  showColumnItem,
  autoResizeColumnItem 
} from './context-menu-utils';

// Pin operations
pinLeftItem<UserType>()
pinRightItem<UserType>()
unpinColumnItem<UserType>()

// Visibility
hideColumnItem<UserType>()
showColumnItem<UserType>()

// Resize
autoResizeColumnItem<UserType>()
```

## Separators

```tsx
import { cellSeparator, headerSeparator } from './context-menu-utils';

// For cell context menus
cellSeparator<UserType>('unique-id')

// For header context menus
headerSeparator<UserType>('unique-id')
```

## Complete Example

```tsx
import { useMemo } from 'react';
import {
  copyCellItem,
  copyRowItem,
  editCellItem,
  deleteRowItem,
  cellSeparator,
  sortAscendingItem,
  sortDescendingItem,
  clearSortItem,
  filterColumnItem,
  clearFilterItem,
  pinLeftItem,
  pinRightItem,
  unpinColumnItem,
  hideColumnItem,
  autoResizeColumnItem,
  headerSeparator
} from './components/data-grid/context-menu-utils';

function MyComponent() {
  // Pick only what you need for cell context menu
  const cellItems = useMemo(() => [
    copyCellItem<User>(),
    copyRowItem<User>(),
    cellSeparator<User>('sep-1'),
    editCellItem<User>((row, column, value) => {
      // Custom edit logic
      handleEdit(row.original, column.id, value);
    }),
    deleteRowItem<User>((row) => {
      // Custom delete logic
      handleDelete(row.original);
    }),
  ], []);

  // Pick only what you need for header context menu
  const headerItems = useMemo(() => [
    sortAscendingItem<User>(),
    sortDescendingItem<User>(),
    clearSortItem<User>(),
    headerSeparator<User>('sep-1'),
    filterColumnItem<User>((column) => {
      openFilterDialog(column.id);
    }),
    clearFilterItem<User>(),
    headerSeparator<User>('sep-2'),
    hideColumnItem<User>(),
    autoResizeColumnItem<User>(),
  ], []);

  return (
    <DataGrid
      data={users}
      columns={columns}
      cellContextMenuItems={cellItems}
      headerContextMenuItems={headerItems}
      enableCellContextMenu={true}
      enableHeaderContextMenu={true}
    />
  );
}
```

## Convenience Bundles (Optional)

If you want common items quickly:

```tsx
import { commonCellItems, commonHeaderItems } from './context-menu-utils';

// Use pre-configured common items
const cellItems = commonCellItems<User>();
const headerItems = commonHeaderItems<User>();

// Or mix with custom items
const cellItems = [
  ...commonCellItems<User>(),
  cellSeparator<User>('custom-sep'),
  customMenuItem<User>(),
];
```

## Benefits of Individual Utilities

- **Granular Control**: Pick exactly what you need
- **Type Safety**: Full TypeScript support
- **Customizable**: Override default behaviors easily
- **Tree Shaking**: Only bundle what you use
- **Developer Friendly**: Clear, descriptive function names
- **Composable**: Mix and match as needed
