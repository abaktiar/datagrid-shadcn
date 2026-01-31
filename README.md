# shadcn/ui DataGrid Component

A feature-rich, composable datagrid component built with TanStack Table v8, shadcn/ui, and Tailwind CSS v4. This implementation follows the comprehensive Product Requirements Document (PRD) for creating a high-performance, accessible, and customizable data grid.

## 🚀 Live Demo

View the live demo here: [https://abaktiar.github.io/datagrid-shadcn/](https://abaktiar.github.io/datagrid-shadcn/)

## 📦 Installation

### Using shadcn CLI (Recommended)

Install the DataGrid component directly into your project:

```bash
npx shadcn@latest add https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json
```

### Alternative Package Managers

**yarn:**
```bash
yarn dlx shadcn@latest add https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json
```

**pnpm:**
```bash
pnpm dlx shadcn@latest add https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json
```

**bun:**
```bash
bunx shadcn@latest add https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json
```

### Manual Installation

If you prefer to install manually:

1. Install dependencies:
```bash
npm install @tanstack/react-table @tanstack/react-virtual lucide-react class-variance-authority clsx tailwind-merge
```

2. Install required shadcn components:
```bash
npx shadcn@latest add button checkbox input select context-menu dropdown-menu
```

3. Copy the data-grid component files from this repository to your project.

## 🚀 Registry Deployment

### Live Registry

The DataGrid component is deployed and available at:
```
https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json
```

### Build Registry Locally

```bash
npm run registry:build
```

This generates registry files in `public/r/` that can be consumed by the shadcn CLI.

### Deploy Your Own Registry

1. Build the registry:
```bash
npm run registry:build
```

2. Deploy your project to Vercel, Netlify, or any static hosting service

3. Your registry will be available at:
```
https://your-domain.com/r/data-grid.json
```

## 🧪 Local Development

To test the registry locally:

1. Start the development server:
```bash
npm run dev
```

2. In another project, install from local server:
```bash
npx shadcn@latest add http://localhost:5173/r/data-grid.json
```

## 🚀 Features

### Core Functionality
- ✅ **Advanced Sorting** - Single and multi-column sorting with visual indicators
- ✅ **Smart Filtering** - Global search and column-specific filtering
- ✅ **Row Selection** - Multi-row selection with checkboxes and indeterminate states
- ✅ **Contextual Actions** - Dynamic action dock for bulk operations on selected rows
- ✅ **Pagination** - Client-side and server-side pagination support
- ✅ **Column Management** - Show/hide columns, column resizing (enabled by default and configurable)
- ✅ **Row Virtualization** - Performance optimization for large datasets
- ✅ **Inline Cell Editing** - Edit data directly within cells, with support for various input types, validation, and configurable behaviors
- ✅ **Customizable Context Menus** - Add right-click menus to cells and headers, using pre-built utilities or custom items for tailored actions
- ✅ **Accessibility** - WCAG compliant with full keyboard navigation

### Technical Features
- 🎨 **Composable Design** - Built with shadcn/ui principles for maximum customization
- ⚡ **High Performance** - Optimized rendering with TanStack Table and Virtual
- 🎯 **TypeScript Support** - Fully typed with comprehensive interfaces
- 📱 **Responsive Design** - Mobile-friendly with Tailwind CSS v4
- ♿ **Accessibility First** - ARIA attributes and keyboard navigation

## 🛠️ Technology Stack

- **TanStack Table v8** - Headless table logic and state management
- **shadcn/ui** - Composable UI components
- **Tailwind CSS v4** - Utility-first styling with modern CSS features
- **TanStack Virtual** - Row virtualization for large datasets
- **React 19** - Latest React features
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and development server

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd datagrid-shadcn

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Usage

### Basic Example

```tsx
import { DataGrid, DataGridColumn, DataGridAction } from './components/data-grid'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
}

const columns: DataGridColumn<User>[] = [
  {
    id: 'firstName',
    header: 'First Name',
    accessorKey: 'firstName',
    enableSorting: true,
    enableFiltering: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    enableSorting: true,
    enableFiltering: true,
  },
  // ... more columns
]

const actions: DataGridAction<User>[] = [
  {
    id: 'delete',
    label: 'Delete Selected',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    onClick: (selectedRows) => {
      // Handle delete action
    },
    isEnabled: (selectedRows) => selectedRows.length > 0,
  },
  // ... more actions
]

function App() {
  return (
    <DataGrid
      data={users}
      columns={columns}
      actions={actions}
      enableRowSelection={true}
      enableSorting={true}
      enableGlobalFilter={true}
      enablePagination={true}
      pageSize={10}
    />
  )
}
```

### Advanced Features

#### Custom Cell Renderers

```tsx
const columns: DataGridColumn<User>[] = [
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
      }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      )
    },
  },
]
```

#### Server-Side Operations

```tsx
<DataGrid
  data={users}
  columns={columns}
  manualPagination={true}
  manualSorting={true}
  manualFiltering={true}
  pageCount={totalPages}
  onPaginationChange={(pageIndex, pageSize) => {
    // Fetch data for new page
  }}
  onSortingChange={(sorting) => {
    // Apply sorting on server
  }}
  onGlobalFilterChange={(filter) => {
    // Apply global filter on server
  }}
/>
```

#### Row Virtualization

```tsx
<DataGrid
  data={largeDataset}
  columns={columns}
  enableVirtualization={true}
  estimateSize={50} // Estimated row height in pixels
/>
```

## 📋 API Reference

### DataGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | - | Array of data objects to display |
| `columns` | `DataGridColumn<TData>[]` | - | Column definitions |
| `actions` | `DataGridAction<TData>[]` | `[]` | Bulk actions for selected rows |
| `enableRowSelection` | `boolean` | `false` | Enable row selection with checkboxes |
| `enableMultiRowSelection` | `boolean` | `true` | Allow multiple row selection |
| `onRowSelectionChange` | `(selectedRows: Row<TData>[]) => void` | `undefined` | Callback when row selection changes. |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enableMultiSort` | `boolean` | `false` | Allow sorting by multiple columns |
| `manualSorting` | `boolean` | `false` | Set to `true` if sorting is handled externally (server-side). Requires `onSortingChange` or `onDataChange`. |
| `onSortingChange` | `(sorting: any[]) => void` | `undefined` | Callback when sorting state changes. Used with `manualSorting`. |
| `enableGlobalFilter` | `boolean` | `true` | Enable global search filter |
| `enableColumnFilters` | `boolean` | `true` | Enable per-column filtering |
| `manualFiltering` | `boolean` | `false` | Set to `true` if filtering (global and column) is handled externally (server-side). Requires `onGlobalFilterChange`, `onColumnFiltersChange`, or `onDataChange`. |
| `onGlobalFilterChange` | `(globalFilter: string) => void` | `undefined` | Callback when global filter value changes. Used with `manualFiltering`. |
| `onColumnFiltersChange` | `(columnFilters: any[]) => void` | `undefined` | Callback when column filters change. Used with `manualFiltering`. |
| `onDataChange` | `(params: DataChangeParams) => void` | `undefined` | Unified callback for server-side operations when pagination, sorting, or filtering changes. See `DataChangeParams` interface. |
| `enablePagination` | `boolean` | `true` | Enable pagination |
| `pageSize` | `number` | `10` | Number of rows per page |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Available page size options |
| `manualPagination` | `boolean` | `false` | Set to `true` if pagination is handled externally (server-side). Requires `pageCount` and `onPaginationChange` or `onDataChange`. |
| `pageCount` | `number` | `undefined` | Total number of pages, required for `manualPagination`. |
| `totalCount` | `number` | `undefined` | Total number of records in the dataset, useful for display with server-side pagination. |
| `onPaginationChange` | `(pageIndex: number, pageSize: number) => void` | `undefined` | Callback when pagination state (page index or size) changes. Used with `manualPagination`. |
| `enableVirtualization` | `boolean` | `false` | Enable row virtualization for large datasets |
| `estimateSize` | `number` | `35` | Estimated row height for virtualization |
| `isLoading` | `boolean` | `false` | Show loading state |
| `error` | `string \| null` | `null` | Error message to display |
| `enableCellEditing` | `boolean` | `false` | Master switch to enable/disable cell editing. |
| `defaultEditMode` | `CellEditMode` | `'click'` | Default mode for triggering cell editing (e.g., 'click', 'doubleClick'). |
| `onCellEdit` | `(value: any, row: Row<TData>, column: Column<TData>) => Promise<boolean> \| boolean` | `undefined` | Callback when a cell's value is successfully edited and saved. Return `false` to indicate save failure. |
| `onCellEditError` | `(error: string, row: Row<TData>, column: Column<TData>) => void` | `undefined` | Callback when an error occurs during cell editing. |
| `enableCellContextMenu` | `boolean` | `false` | Enable right-click context menus on data cells. |
| `enableHeaderContextMenu` | `boolean` | `false` | Enable right-click context menus on column headers. |
| `cellContextMenuItems` | `CellContextMenuItem<TData>[]` | `[]` | Array of items for cell context menus. |
| `headerContextMenuItems` | `HeaderContextMenuItem<TData>[]` | `[]` | Array of items for header context menus. |
| `enableColumnResizing` | `boolean` | `true` | Enable/disable column resizing for the entire grid. |
| `onColumnSizingChange` | `(columnSizing: Record<string, number>) => void` | `undefined` | Callback when column sizes change due to resizing. |
| `className` | `string` | `undefined` | Custom CSS class name for the main DataGrid container. |
| `'aria-label'` | `string` | `'Data grid'` |  ARIA label for the DataGrid region. |
| `'aria-describedby'` | `string` | `undefined` | ARIA describedby attribute for the DataGrid region. |

### DataGridColumn Interface

```tsx
interface DataGridColumn<TData> {
  id: string
  header: string | ReactNode
  accessorKey?: keyof TData
  cell?: ({ row }: { row: Row<TData> }) => ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
  enableEditing?: boolean | CellEditConfig<TData> // Enable or configure cell editing for this column. See `CellEditConfig<TData>` for advanced options.
  enableHiding?: boolean
  enableResizing?: boolean
  size?: number
  minSize?: number
  maxSize?: number
}
```

### DataGridAction Interface

```tsx
interface DataGridAction<TData> {
  id: string
  label: string
  icon?: ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  onClick: (selectedRows: Row<TData>[]) => void | Promise<void>
  isEnabled?: (selectedRows: Row<TData>[]) => boolean
  isVisible?: (selectedRows: Row<TData>[]) => boolean
}
```

### DataChangeParams Interface
This interface defines the object passed to the `onDataChange` callback, used for server-side data operations.

| Property     | Type                                  | Description                                                                 |
|--------------|---------------------------------------|-----------------------------------------------------------------------------|
| `pagination` | `{ pageIndex: number; pageSize: number }` | Contains the current page index and page size.                               |
| `sorting`    | `Array<{ id: string; desc: boolean }>` | Array of sorting objects, each with a column `id` and `desc` (descending) flag. |
| `filters`    | `Array<{ id:string; value: any }>`    | Array of column filter objects, each with a column `id` and filter `value`.   |
| `globalFilter` | `string`                              | The current global filter string.                                           |

### CellEditConfig<TData> Interface
Used to configure cell editing behavior for a column via the `DataGridColumn.enableEditing` prop.

| Property      | Type                                                                 | Description                                                                                                                              |
|---------------|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `enabled`     | `boolean`                                                            | Whether editing is enabled for this column.                                                                                                |
| `behavior`    | `CellEditBehavior`                                                   | Defines how editing is triggered and saved (e.g., 'click', 'doubleClick', save on blur/enter). See `EditBehaviors` in `types.ts`.        |
| `component`   | `ComponentType<CellEditComponentProps<TData, TValue>>`               | Custom React component for the cell editor. Defaults to a text input. See `edit-components.tsx` for more.                          |
| `validate`    | `(value: TValue, row: Row<TData>) => string \| null`                   | Function to validate the edited value. Return an error string or `null`.                                                                 |
| `onSave`      | `(value: TValue, row: Row<TData>, column: Column<TData>) => Promise<boolean> \| boolean` | Callback when an edit is saved for this specific column. Overrides global `onCellEdit` for this column if provided. Return `false` for failure. |
| `placeholder` | `string`                                                             | Placeholder text for the edit input.                                                                                                   |
| `disabled`    | `(row: Row<TData>) => boolean`                                       | Function to conditionally disable editing for specific rows.                                                                             |

*Note: For more advanced `CellEditConfig` options like `onCancel`, `onEditStart`, `onEditEnd`, and `EditBehaviors`, please refer to `src/components/data-grid/types.ts` and the cell editing implementation.*

### CellContextMenuItem<TData> Interface
Defines an item for a cell context menu, used with the `cellContextMenuItems` prop.

| Property    | Type                                                              | Description                                                            |
|-------------|-------------------------------------------------------------------|------------------------------------------------------------------------|
| `id`        | `string`                                                          | Unique ID for the menu item.                                           |
| `label`     | `string`                                                          | Text displayed for the menu item.                                      |
| `icon`      | `ReactNode`                                                       | Optional icon to display next to the label.                            |
| `onClick`   | `(row: Row<TData>, column: Column<TData>, value: any) => void \| Promise<void>` | Function called when the item is clicked.                              |
| `isEnabled` | `(row: Row<TData>, column: Column<TData>, value: any) => boolean` | Optional function to determine if the item is enabled.                 |
| `isVisible` | `(row: Row<TData>, column: Column<TData>, value: any) => boolean` | Optional function to determine if the item is visible.                 |
| `separator` | `boolean`                                                         | If `true`, renders a separator instead of a clickable item.            |
| `variant`   | `'default' \| 'destructive'`                                      | Optional variant, e.g., for destructive actions.                     |

*Tip: Utility functions in `src/components/data-grid/context-menu-utils.tsx` (like `copyCellItem()`) provide pre-configured `CellContextMenuItem` objects.*

### HeaderContextMenuItem<TData> Interface
Defines an item for a header context menu, used with the `headerContextMenuItems` prop.

| Property    | Type                                                     | Description                                                            |
|-------------|----------------------------------------------------------|------------------------------------------------------------------------|
| `id`        | `string`                                                 | Unique ID for the menu item.                                           |
| `label`     | `string`                                                 | Text displayed for the menu item.                                      |
| `icon`      | `ReactNode`                                              | Optional icon to display next to the label.                            |
| `onClick`   | `(column: Column<TData>) => void \| Promise<void>`       | Function called when the item is clicked.                              |
| `isEnabled` | `(column: Column<TData>) => boolean`                     | Optional function to determine if the item is enabled.                 |
| `isVisible` | `(column: Column<TData>) => boolean`                     | Optional function to determine if the item is visible.                 |
| `separator` | `boolean`                                                | If `true`, renders a separator instead of a clickable item.            |
| `variant`   | `'default' \| 'destructive'`                             | Optional variant, e.g., for destructive actions.                     |

*Tip: Utility functions in `src/components/data-grid/context-menu-utils.tsx` (like `sortAscendingItem()`) provide pre-configured `HeaderContextMenuItem` objects.*

## 🏗️ Architecture

The DataGrid component follows a composable architecture with clear separation of concerns:

### Core Components

- **DataGrid** - Main container component that orchestrates all functionality
- **DataGridHeader** - Handles column headers, sorting indicators, and resizing
- **DataGridBody** - Renders table rows with support for virtualization
- **DataGridPagination** - Pagination controls and page size selection
- **DataGridFilters** - Global search and column visibility controls
- **DataGridActionDock** - Contextual actions for selected rows

### State Management

The component uses TanStack Table's built-in state management for:
- Row selection state
- Sorting state
- Filtering state
- Pagination state
- Column visibility and sizing

### Performance Optimizations

- **Memoization** - React.memo and useMemo for preventing unnecessary re-renders
- **Virtualization** - TanStack Virtual for handling large datasets
- **Debounced Filtering** - Optimized search input handling
- **Efficient Updates** - Minimal DOM manipulations through TanStack Table

## 🎨 Customization

### Styling

The component is fully customizable using Tailwind CSS classes. All styling is applied through utility classes, making it easy to modify the appearance:

```tsx
<DataGrid
  className="custom-datagrid"
  // ... other props
/>
```

### Theme Support

The component supports both light and dark themes through Tailwind CSS variables defined in `src/index.css`.

### Custom Components

You can replace any sub-component by creating your own implementation:

```tsx
// Custom header component
const CustomHeader = () => {
  const { table } = useDataGrid()
  // Custom implementation
}

// Use in your DataGrid
<DataGrid
  // ... props
  components={{
    Header: CustomHeader
  }}
/>
```

## ♿ Accessibility

The DataGrid component is built with accessibility in mind:

- **ARIA Attributes** - Proper roles, labels, and descriptions
- **Keyboard Navigation** - Full keyboard support for all interactions
- **Screen Reader Support** - Semantic markup and announcements
- **Focus Management** - Logical tab order and focus indicators
- **High Contrast** - Support for high contrast themes

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Navigate between interactive elements |
| `Space` | Toggle row selection |
| `Enter` | Activate buttons and links |
| `Arrow Keys` | Navigate within dropdown menus |
| `Escape` | Close dropdown menus |

## 🧪 Testing

The component includes comprehensive testing setup:

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
src/
├── components/
│   ├── data-grid/
│   │   ├── data-grid.tsx           # Main DataGrid component
│   │   ├── data-grid-header.tsx    # Header component
│   │   ├── data-grid-body.tsx      # Body component
│   │   ├── data-grid-pagination.tsx # Pagination component
│   │   ├── data-grid-filters.tsx   # Filters component
│   │   ├── data-grid-action-dock.tsx # Action dock component
│   │   ├── context.tsx             # React context
│   │   ├── types.ts                # TypeScript interfaces
│   │   └── index.ts                # Exports
│   └── ui/                         # shadcn/ui components
├── data/
│   └── sample-data.ts              # Sample data for demo
├── lib/
│   └── utils.ts                    # Utility functions
├── App.tsx                         # Demo application
├── main.jsx                        # React entry point
└── index.css                       # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TanStack Table](https://tanstack.com/table) - For the excellent headless table library
- [shadcn/ui](https://ui.shadcn.com/) - For the beautiful and composable UI components
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Lucide React](https://lucide.dev/) - For the beautiful icons
