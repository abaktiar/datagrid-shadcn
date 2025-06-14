import { useMemo } from 'react';
import { Trash2, Download, CheckCircle, Archive, User as UserIcon, Mail, Calendar } from 'lucide-react';
import { DataGrid, DataGridColumn, DataGridAction } from './components/data-grid';
import {
  copyCellItem,
  copyRowItem,
  editCellItem,
  deleteRowItem,
  selectRowItem,
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
  cellSeparator,
  headerSeparator,
} from './components/data-grid/context-menu-utils';
import { sampleUsers, type User as UserType } from './data/sample-data';

function App() {
  // Define columns for the user data
  const columns: DataGridColumn<UserType>[] = useMemo(
    () => [
      {
        id: 'firstName',
        header: 'First Name',
        accessorKey: 'firstName',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        // size: 120,
        // minSize: 80,
        // maxSize: 200,
      },
      {
        id: 'lastName',
        header: 'Last Name',
        accessorKey: 'lastName',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        size: 120,
        minSize: 80,
        maxSize: 200,
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        size: 200,
        minSize: 50,
        maxSize: 500,
        cell: ({ row }) => (
          <div className='flex items-center space-x-2'>
            <Mail className='h-4 w-4 text-muted-foreground' />
            <span>{row.original.email}</span>
          </div>
        ),
      },
      {
        id: 'role',
        header: 'Role',
        accessorKey: 'role',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        size: 100,
        minSize: 80,
        maxSize: 150,
        cell: ({ row }) => (
          <div className='flex items-center space-x-2'>
            <UserIcon className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>{row.original.role}</span>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        size: 120,
        minSize: 100,
        maxSize: 150,
        cell: ({ row }) => {
          const status = row.original.status;
          const statusColors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
          };
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: 'lastLogin',
        header: 'Last Login',
        accessorKey: 'lastLogin',
        enableSorting: true,
        enableResizing: true,
        size: 140,
        minSize: 120,
        maxSize: 180,
        cell: ({ row }) => (
          <div className='flex items-center space-x-2'>
            <Calendar className='h-4 w-4 text-muted-foreground' />
            <span>{new Date(row.original.lastLogin).toLocaleDateString()}</span>
          </div>
        ),
      },
    ],
    []
  );

  // Define context menu items - pick and choose what you need!
  const cellContextMenuItems = useMemo(
    () => [
      copyCellItem<UserType>(),
      copyRowItem<UserType>(),
      cellSeparator<UserType>('sep-1'),
      editCellItem<UserType>((row, column, value) => {
        alert(`Edit ${column.id}: ${value} for user ${row.original.firstName}`);
      }),
      selectRowItem<UserType>(),
      cellSeparator<UserType>('sep-2'),
      deleteRowItem<UserType>((row) => {
        if (confirm(`Delete user ${row.original.firstName} ${row.original.lastName}?`)) {
          alert('User deleted!');
        }
      }),
    ],
    []
  );

  const headerContextMenuItems = useMemo(
    () => [
      sortAscendingItem<UserType>(),
      sortDescendingItem<UserType>(),
      clearSortItem<UserType>(),
      headerSeparator<UserType>('sep-1'),
      filterColumnItem<UserType>((column) => {
        alert(`Open filter dialog for ${column.id}`);
      }),
      clearFilterItem<UserType>(),
      headerSeparator<UserType>('sep-2'),
      pinLeftItem<UserType>(),
      pinRightItem<UserType>(),
      unpinColumnItem<UserType>(),
      headerSeparator<UserType>('sep-3'),
      hideColumnItem<UserType>(),
      autoResizeColumnItem<UserType>(),
    ],
    []
  );

  // Define actions for selected rows
  const actions: DataGridAction<UserType>[] = useMemo(
    () => [
      {
        id: 'delete',
        label: 'Delete Selected',
        icon: <Trash2 className='h-4 w-4' />,
        variant: 'destructive',
        onClick: (selectedRows) => {
          const userNames = selectedRows.map((row) => `${row.original.firstName} ${row.original.lastName}`);
          alert(`Delete users: ${userNames.join(', ')}`);
        },
        isEnabled: (selectedRows) => selectedRows.length > 0,
      },
      {
        id: 'export',
        label: 'Export Selected',
        icon: <Download className='h-4 w-4' />,
        variant: 'outline',
        onClick: (selectedRows) => {
          const data = selectedRows.map((row) => row.original);
          console.log('Exporting users:', data);
          alert(`Exported ${selectedRows.length} users to CSV`);
        },
        isEnabled: (selectedRows) => selectedRows.length > 0,
      },
      {
        id: 'activate',
        label: 'Mark as Active',
        icon: <CheckCircle className='h-4 w-4' />,
        variant: 'default',
        onClick: (selectedRows) => {
          const userNames = selectedRows.map((row) => `${row.original.firstName} ${row.original.lastName}`);
          alert(`Activate users: ${userNames.join(', ')}`);
        },
        isEnabled: (selectedRows) => selectedRows.some((row) => row.original.status !== 'active'),
      },
      {
        id: 'archive',
        label: 'Archive Selected',
        icon: <Archive className='h-4 w-4' />,
        variant: 'secondary',
        onClick: (selectedRows) => {
          const userNames = selectedRows.map((row) => `${row.original.firstName} ${row.original.lastName}`);
          alert(`Archive users: ${userNames.join(', ')}`);
        },
        isEnabled: (selectedRows) => selectedRows.length > 0,
      },
    ],
    []
  );

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight'>shadcn/ui DataGrid Component</h1>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            A feature-rich, composable datagrid built with TanStack Table v8, shadcn/ui, and Tailwind CSS v4. Supports
            sorting, filtering, pagination, row selection, and bulk actions.
          </p>
        </div>

        {/* DataGrid */}
        <div className='space-y-4'>
          <DataGrid
            data={sampleUsers}
            columns={columns}
            actions={actions}
            enableRowSelection={true}
            enableMultiRowSelection={true}
            enableSorting={true}
            enableMultiSort={false}
            enableGlobalFilter={true}
            enableColumnFilters={true}
            enablePagination={true}
            pageSize={5}
            pageSizeOptions={[5, 10, 20, 50]}
            cellContextMenuItems={cellContextMenuItems}
            headerContextMenuItems={headerContextMenuItems}
            enableCellContextMenu={true}
            enableHeaderContextMenu={true}
            aria-label='User management table'
          />
        </div>

        {/* Features */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
          <div className='bg-card p-6 rounded-lg border'>
            <h3 className='font-semibold mb-2'>🔍 Advanced Filtering</h3>
            <p className='text-sm text-muted-foreground'>
              Global search and column-specific filtering with real-time results
            </p>
          </div>
          <div className='bg-card p-6 rounded-lg border'>
            <h3 className='font-semibold mb-2'>📊 Smart Sorting</h3>
            <p className='text-sm text-muted-foreground'>Single and multi-column sorting with visual indicators</p>
          </div>
          <div className='bg-card p-6 rounded-lg border'>
            <h3 className='font-semibold mb-2'>✅ Row Selection</h3>
            <p className='text-sm text-muted-foreground'>Multi-row selection with contextual bulk actions</p>
          </div>
          <div className='bg-card p-6 rounded-lg border'>
            <h3 className='font-semibold mb-2'>📄 Pagination</h3>
            <p className='text-sm text-muted-foreground'>Client-side and server-side pagination support</p>
          </div>
          <div className='bg-card p-6 rounded-lg border'>
            <h3 className='font-semibold mb-2'>🎨 Customizable</h3>
            <p className='text-sm text-muted-foreground'>Fully composable with shadcn/ui design system</p>
          </div>
          <div className='bg-card p-6 rounded-lg border'>
            <h3 className='font-semibold mb-2'>♿ Accessible</h3>
            <p className='text-sm text-muted-foreground'>WCAG compliant with full keyboard navigation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
