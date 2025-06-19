import { useMemo, useState, useEffect, useCallback } from 'react';
import { Trash2, Download, CheckCircle, Archive, Server, Monitor, Copy, Check, Github, Heart, Sun, Moon } from 'lucide-react';
import {
  DataGrid,
  DataGridColumn,
  DataGridAction,
  DataChangeParams,
  TextEditInput,
  createSelectEditComponent,
  BehaviorBuilder,
  EditBehaviors,
} from './components/data-grid';
import { Button } from './components/ui/button';
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

// Status options for the select dropdown
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

// Create status select component
const StatusSelectInput = createSelectEditComponent<UserType>(statusOptions);

function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Demo state for server-side vs client-side
  const [isServerSide, setIsServerSide] = useState(false);

  // Copy to clipboard state
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [selectedPackageManager, setSelectedPackageManager] = useState<string>('npm');

  // Package manager commands
  const packageCommands = {
    npm: 'npx shadcn@latest add https://datagrid-shadcn.netlify.app/r/data-grid.json',
    yarn: 'yarn dlx shadcn@latest add https://datagrid-shadcn.netlify.app/r/data-grid.json',
    pnpm: 'pnpm dlx shadcn@latest add https://datagrid-shadcn.netlify.app/r/data-grid.json',
    bun: 'bunx shadcn@latest add https://datagrid-shadcn.netlify.app/r/data-grid.json',
  };

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(packageCommands[selectedPackageManager as keyof typeof packageCommands]);
      setCopiedCommand(selectedPackageManager);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const [serverData, setServerData] = useState(sampleUsers.slice(0, 15)); // Start with first page
  const [totalCount, setTotalCount] = useState(sampleUsers.length);
  const [pageCount, setPageCount] = useState(Math.ceil(sampleUsers.length / 15));
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState(sampleUsers); // For client-side editing

  // Handle cell editing
  const handleCellEdit = useCallback(
    async (value: any, row: any, column: any): Promise<boolean> => {
      try {
        console.log('Editing cell:', {
          rowId: row.id,
          columnId: column.id,
          oldValue: row.original[column.accessorKey],
          newValue: value,
        });

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (isServerSide) {
          // Update server data
          setServerData((prevData) =>
            prevData.map((item) => (item.id === row.original.id ? { ...item, [column.accessorKey]: value } : item))
          );
        } else {
          // Update client data
          setClientData((prevData) =>
            prevData.map((item) => (item.id === row.original.id ? { ...item, [column.accessorKey]: value } : item))
          );
        }

        return true; // Success
      } catch (error) {
        console.error('Failed to save cell edit:', error);
        return false; // Failure
      }
    },
    [isServerSide]
  );

  // Handle cell edit errors
  const handleCellEditError = useCallback((error: string, row: any, column: any) => {
    console.error('Cell edit error:', error, {
      user: `${row.original.firstName} ${row.original.lastName}`,
      column: column.id,
    });
    // In a real app, you might show a toast notification here
    alert(`Failed to save ${column.id}: ${error}`);
  }, []);

  // Simulate server-side data fetching
  const handleDataChange = useCallback(async (params: DataChangeParams) => {
    console.log('handleDataChange called with:', params);
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulate server-side operations
      let filteredData = [...sampleUsers];

      // Apply global filter
      if (params.globalFilter) {
        filteredData = filteredData.filter((user) =>
          Object.values(user).some((value) => String(value).toLowerCase().includes(params.globalFilter.toLowerCase()))
        );
      }

      // Apply sorting
      if (params.sorting.length > 0) {
        const sort = params.sorting[0];
        filteredData.sort((a, b) => {
          const aVal = (a as any)[sort.id];
          const bVal = (b as any)[sort.id];
          if (aVal < bVal) return sort.desc ? 1 : -1;
          if (aVal > bVal) return sort.desc ? -1 : 1;
          return 0;
        });
      }

      // Apply pagination
      const startIndex = params.pagination.pageIndex * params.pagination.pageSize;
      const endIndex = startIndex + params.pagination.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      console.log('Setting server data:', paginatedData);
      setServerData(paginatedData);
      setTotalCount(filteredData.length);
      setPageCount(Math.ceil(filteredData.length / params.pagination.pageSize));
    } catch (error) {
      console.error('Error in handleDataChange:', error);
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  }, []);

  // Effect to handle initial load when switching to server-side mode
  useEffect(() => {
    if (isServerSide) {
      // Trigger initial data load for server-side mode
      handleDataChange({
        pagination: { pageIndex: 0, pageSize: 15 },
        sorting: [],
        filters: [],
        globalFilter: '',
      });
    } else {
      // Reset to client-side data
      setServerData(sampleUsers.slice(0, 15));
      setTotalCount(sampleUsers.length);
      setPageCount(Math.ceil(sampleUsers.length / 15));
      setIsLoading(false); // Ensure loading is false for client-side
    }
  }, [isServerSide]);

  // Define columns for the user data
  const columns: DataGridColumn<UserType>[] = useMemo(
    () => [
      {
        id: 'firstName',
        header: 'First Name (Click)',
        accessorKey: 'firstName',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        enableEditing: {
          enabled: true,
          behavior: EditBehaviors.clickToEdit,
          component: TextEditInput,
          placeholder: 'Enter first name...',
          validate: (value: string) => {
            if (!value?.trim()) return 'First name is required';
            if (value.length < 2) return 'First name must be at least 2 characters';
            return null;
          },
        },
        size: 140,
        minSize: 100,
        maxSize: 200,
      },
      {
        id: 'lastName',
        header: 'Last Name (Blur)',
        accessorKey: 'lastName',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        enableEditing: {
          enabled: true,
          behavior: {
            mode: 'click',
            saveOn: ['blur'],
            cancelOn: ['escape'],
            showActionButtons: false,
            autoFocus: true,
            selectAllOnFocus: true,
          },
          component: TextEditInput,
          placeholder: 'Enter last name...',
          validate: (value: string) => {
            if (!value?.trim()) return 'Last name is required';
            return null;
          },
        },
        size: 140,
        minSize: 100,
        maxSize: 200,
      },
      {
        id: 'email',
        header: 'Email (Click + Buttons)',
        accessorKey: 'email',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        enableEditing: {
          enabled: true,
          behavior: EditBehaviors.clickWithButtons,
          component: TextEditInput,
          placeholder: 'Enter email...',
          validate: (value: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return value && !emailRegex.test(value) ? 'Invalid email format' : null;
          },
        },
        size: 220,
        minSize: 150,
        maxSize: 300,
        cell: ({ row }) => <span className='text-sm'>{row.original.email}</span>,
      },
      {
        id: 'role',
        header: 'Role (Double-Click)',
        accessorKey: 'role',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        enableEditing: {
          enabled: true,
          behavior: EditBehaviors.doubleClickToEdit,
          component: createSelectEditComponent([
            { value: 'Admin', label: 'Admin' },
            { value: 'Editor', label: 'Editor' },
            { value: 'Viewer', label: 'Viewer' },
          ]),
          placeholder: 'Select role...',
        },
        size: 150,
        minSize: 120,
        maxSize: 180,
        cell: ({ row }) => <span className='text-sm font-medium'>{row.original.role}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        enableEditing: {
          enabled: true,
          behavior: BehaviorBuilder.create().doubleClickToEdit().withActionButtons('bottom-right').build(),
          component: StatusSelectInput,
        },
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
        cell: ({ row }) => <span className='text-sm'>{new Date(row.original.lastLogin).toLocaleDateString()}</span>,
      },
      {
        id: 'priority',
        header: 'Priority',
        accessorKey: 'priority',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,

        size: 150,
        minSize: 120,
        maxSize: 180,
        cell: ({ row }) => {
          const priority = (row.original as any).priority || 'Medium';
          const priorityColors = {
            High: 'bg-red-100 text-red-800',
            Medium: 'bg-yellow-100 text-yellow-800',
            Low: 'bg-green-100 text-green-800',
          };
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                priorityColors[priority as keyof typeof priorityColors]
              }`}>
              {priority}
            </span>
          );
        },
      },
      {
        id: 'department',
        header: 'Department',
        accessorKey: 'department',
        enableSorting: true,
        enableFiltering: true,
        enableResizing: true,
        size: 120,
        minSize: 100,
        maxSize: 150,
        cell: ({ row }) => <span className='text-sm'>{(row.original as any).department || 'Engineering'}</span>,
      },
      {
        id: 'notes',
        header: 'Notes (Enter to Save)',
        accessorKey: 'notes',
        enableSorting: false,
        enableFiltering: true,
        enableResizing: true,
        enableEditing: {
          enabled: true,
          behavior: {
            mode: 'click',
            saveOn: ['enter'],
            cancelOn: ['escape'],
            showActionButtons: false,
            autoFocus: true,
            selectAllOnFocus: false,
          },
          component: TextEditInput,
          placeholder: 'Add notes...',
        },
        size: 180,
        minSize: 150,
        maxSize: 300,
        cell: ({ row }) => (
          <span className='text-sm text-muted-foreground italic'>{(row.original as any).notes || 'No notes'}</span>
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
        <div className='relative text-center space-y-4'> {/* Added relative positioning */}
          {/* Container for icons in the top right */}
          <div className='absolute top-0 right-0 flex items-center p-2 space-x-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleTheme}
              aria-label='Toggle theme'
              className='text-muted-foreground hover:text-foreground'
            >
              {theme === 'light' ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
            </Button>
            <a
              href='https://github.com/abaktiar/datagrid-shadcn'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground'
            >
              <Github className='h-6 w-6' />
            </a>
          </div>
          <h1 className='text-4xl font-bold tracking-tight pt-10'>shadcn/ui DataGrid Component</h1> {/* Adjusted padding-top */}
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            A feature-rich, composable datagrid built with TanStack Table v8, shadcn/ui, and Tailwind CSS v4. Supports
            sorting, filtering, pagination, row selection, bulk actions, and inline cell editing.
          </p>
          <p className='text-sm text-muted-foreground max-w-4xl mx-auto'>
            💡 Try editing modes: <strong>Click</strong> First Name, <strong>Blur</strong> Last Name,{' '}
            <strong>Click + Buttons (Top-Right)</strong> Email, <strong>Double-click + Buttons (Bottom-Right)</strong>{' '}
            Status, <strong>Double-click</strong> Role, <strong>Enter</strong> Notes
          </p>

          {/* Mode Toggle */}
          <div className='flex items-center justify-center gap-4'>
            <Button
              variant={!isServerSide ? 'default' : 'outline'}
              onClick={() => setIsServerSide(false)}
              className='flex items-center gap-2'>
              <Monitor className='h-4 w-4' />
              Client-Side
            </Button>
            <Button
              variant={isServerSide ? 'default' : 'outline'}
              onClick={() => setIsServerSide(true)}
              className='flex items-center gap-2'>
              <Server className='h-4 w-4' />
              Server-Side
            </Button>
          </div>

          <p className='text-sm text-muted-foreground'>
            {isServerSide
              ? '🌐 Server-side mode: Data is fetched and processed on the server'
              : '💻 Client-side mode: All operations performed in the browser'}
          </p>
        </div>

        {/* DataGrid */}
        <div className='space-y-4'>
          <DataGrid
            data={isServerSide ? serverData : clientData}
            columns={columns}
            actions={actions}
            enableRowSelection={true}
            enableMultiRowSelection={true}
            enableSorting={true}
            enableMultiSort={false}
            enableGlobalFilter={true}
            enableColumnFilters={true}
            enablePagination={true}
            pageSize={15}
            pageSizeOptions={[10, 15, 25, 50]}
            // Cell editing
            enableCellEditing={true}
            defaultEditMode='click'
            onCellEdit={handleCellEdit}
            onCellEditError={handleCellEditError}
            // Server-side props
            manualPagination={isServerSide}
            manualSorting={isServerSide}
            manualFiltering={isServerSide}
            totalCount={isServerSide ? totalCount : undefined}
            pageCount={isServerSide ? pageCount : undefined}
            isLoading={isServerSide ? isLoading : false}
            onDataChange={isServerSide ? handleDataChange : undefined}
            // Context menus
            cellContextMenuItems={cellContextMenuItems}
            headerContextMenuItems={headerContextMenuItems}
            enableCellContextMenu={true}
            enableHeaderContextMenu={true}
            aria-label='User management table'
          />
        </div>

        {/* Installation Section */}
        <div className='mt-12 mb-12'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-8'>
              <h2 className='text-2xl font-bold mb-2'>📦 Quick Installation</h2>
              <p className='text-muted-foreground'>Add the DataGrid component to your project with a single command</p>
            </div>

            <div className='space-y-4'>
              {/* Package Manager Tabs - Top Left */}
              <div className='flex items-center'>
                <div className='inline-flex items-center bg-muted/50 rounded-lg p-1 border'>
                  {Object.keys(packageCommands).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setSelectedPackageManager(pm)}
                      className={`px-3 py-1.5 text-sm font-medium rounded transition-all duration-200 ${
                        selectedPackageManager === pm
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }`}>
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Command Display */}
              <div className='relative'>
                <div className='flex items-center gap-3 bg-background rounded-lg border p-4'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <div className='w-3 h-3 rounded-full bg-red-500'></div>
                    <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
                    <div className='w-3 h-3 rounded-full bg-green-500'></div>
                  </div>
                  <div className='flex-1 font-mono text-sm text-foreground overflow-x-auto px-2'>
                    <span className='text-muted-foreground'>$ </span>
                    {packageCommands[selectedPackageManager as keyof typeof packageCommands]}
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={copyToClipboard}
                    className='h-8 w-8 p-0 flex-shrink-0 hover:bg-muted'>
                    {copiedCommand === selectedPackageManager ? (
                      <Check className='h-4 w-4 text-green-600' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                  </Button>
                </div>

                {/* Success message */}
                {copiedCommand === selectedPackageManager && (
                  <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2'>
                    <div className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md border border-green-200'>
                      Copied to clipboard!
                    </div>
                  </div>
                )}
              </div>

              <div className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  This will install the DataGrid component and all its dependencies to your project
                </p>
              </div>
            </div>
          </div>
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
          <div className='bg-card p-6 rounded-lg border'>
            <h3 className='font-semibold mb-2'>✏️ Inline Editing</h3>
            <p className='text-sm text-muted-foreground'>
              Click to edit cells with validation and custom input components
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className='mt-16 py-6 border-t'> {/* Increased padding */}
          <div className='max-w-4xl mx-auto px-4'>
            {/* Changed justify-between to justify-center */}
            <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <span>Built with</span>
                <Heart className='h-4 w-4 text-red-500 fill-current' />
                <span>by</span>
                <a
                  href='https://github.com/abaktiar'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-foreground hover:text-primary transition-colors'>
                  abaktiar
                </a>
                <span>&</span>
                <span className='font-medium text-foreground'>AI✨</span>
              </div>
              <img
                src='https://visitor-badge.laobi.icu/badge?page_id=abaktiar.datagrid-shadcn'
                alt='Visitor count'
                className='mx-auto my-2' // Added margin for spacing and auto horizontal margins for centering
              />
              {/* The GitHub link previously here has been removed */}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
