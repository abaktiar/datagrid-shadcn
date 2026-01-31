import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  Download,
  CheckCircle,
  Archive,
  Server,
  Monitor,
  Copy,
  Check,
  Github,
  Sun,
  Moon,
  Search,
  ArrowUpDown,
  CheckSquare,
  FileText,
  Paintbrush,
  Accessibility,
  Pencil,
  Sparkles,
  Terminal,
  ChevronRight,
  Table2,
  Zap,
} from 'lucide-react';
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

// Feature card data
const features = [
  {
    icon: Search,
    title: 'Advanced Filtering',
    description: 'Global search and column-specific filtering with real-time results',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: ArrowUpDown,
    title: 'Smart Sorting',
    description: 'Single and multi-column sorting with visual indicators',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: CheckSquare,
    title: 'Row Selection',
    description: 'Multi-row selection with contextual bulk actions',
    gradient: 'from-yellow-500 to-amber-600',
  },
  {
    icon: FileText,
    title: 'Pagination',
    description: 'Client-side and server-side pagination support',
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    icon: Paintbrush,
    title: 'Customizable',
    description: 'Fully composable with shadcn/ui design system',
    gradient: 'from-red-500 to-orange-600',
  },
  {
    icon: Accessibility,
    title: 'Accessible',
    description: 'WCAG compliant with full keyboard navigation',
    gradient: 'from-amber-600 to-yellow-500',
  },
  {
    icon: Pencil,
    title: 'Inline Editing',
    description: 'Click to edit cells with validation and custom inputs',
    gradient: 'from-orange-600 to-red-600',
  },
];

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
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Demo state for server-side vs client-side
  const [isServerSide, setIsServerSide] = useState(false);

  // Copy to clipboard state
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [selectedPackageManager, setSelectedPackageManager] = useState<string>('npm');

  // Package manager commands
  const packageCommands = {
    npm: 'npx shadcn@latest add https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json',
    yarn: 'yarn dlx shadcn@latest add https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json',
    pnpm: 'pnpm dlx shadcn@latest add https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json',
    bun: 'bunx shadcn@latest add https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json',
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

  const [serverData, setServerData] = useState(sampleUsers.slice(0, 5));
  const [totalCount, setTotalCount] = useState(sampleUsers.length);
  const [pageCount, setPageCount] = useState(Math.ceil(sampleUsers.length / 5));
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState(sampleUsers);

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

        await new Promise((resolve) => setTimeout(resolve, 300));

        if (isServerSide) {
          setServerData((prevData) =>
            prevData.map((item) => (item.id === row.original.id ? { ...item, [column.accessorKey]: value } : item))
          );
        } else {
          setClientData((prevData) =>
            prevData.map((item) => (item.id === row.original.id ? { ...item, [column.accessorKey]: value } : item))
          );
        }

        return true;
      } catch (error) {
        console.error('Failed to save cell edit:', error);
        return false;
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
    alert(`Failed to save ${column.id}: ${error}`);
  }, []);

  // Simulate server-side data fetching
  const handleDataChange = useCallback(async (params: DataChangeParams) => {
    console.log('handleDataChange called with:', params);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredData = [...sampleUsers];

      if (params.globalFilter) {
        filteredData = filteredData.filter((user) =>
          Object.values(user).some((value) => String(value).toLowerCase().includes(params.globalFilter.toLowerCase()))
        );
      }

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

  useEffect(() => {
    if (isServerSide) {
      handleDataChange({
        pagination: { pageIndex: 0, pageSize: 5 },
        sorting: [],
        filters: [],
        globalFilter: '',
      });
    } else {
      setServerData(sampleUsers.slice(0, 5));
      setTotalCount(sampleUsers.length);
      setPageCount(Math.ceil(sampleUsers.length / 5));
      setIsLoading(false);
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
        cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
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
        cell: ({ row }) => <span className="text-sm font-medium">{row.original.role}</span>,
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
            active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
            inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
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
        cell: ({ row }) => <span className="text-sm">{new Date(row.original.lastLogin).toLocaleDateString()}</span>,
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
            High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
            Low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
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
        cell: ({ row }) => <span className="text-sm">{(row.original as any).department || 'Engineering'}</span>,
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
          <span className="text-sm text-muted-foreground italic">{(row.original as any).notes || 'No notes'}</span>
        ),
      },
    ],
    []
  );

  // Define context menu items
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
        icon: <Trash2 className="h-4 w-4" />,
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
        icon: <Download className="h-4 w-4" />,
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
        icon: <CheckCircle className="h-4 w-4" />,
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
        icon: <Archive className="h-4 w-4" />,
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 geometric-grid opacity-30 dark:opacity-20 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-chart-5/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Navigation bar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-chart-5 flex items-center justify-center shadow-lg">
              <Table2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">DataGrid</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              shadcn/ui
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-muted-foreground hover:text-foreground">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <a
              href="https://github.com/abaktiar/datagrid-shadcn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-card border hover:bg-muted transition-colors">
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Visitor badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border text-xs text-muted-foreground mb-8 animate-fade-in-up opacity-0">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Production-ready data tables for React</span>
              <img
                src="https://visitor-badge.laobi.icu/badge?page_id=abaktiar.datagrid-shadcn"
                alt="Visitor count"
                className="h-4"
              />
            </div>

            {/* Main title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up opacity-0 delay-100">
              <span className="gradient-text">DataGrid</span>
              <br />
              <span className="text-foreground">for shadcn/ui</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up opacity-0 delay-200">
              A feature-rich, composable datagrid built with TanStack Table v8 and Tailwind CSS v4. Sorting, filtering,
              pagination, row selection, and inline cell editing — all in one package.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up opacity-0 delay-300">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-chart-5 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Zap className="w-4 h-4" />
                Try the Demo
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#install"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border font-medium hover:bg-muted transition-colors">
                <Terminal className="w-4 h-4" />
                Quick Install
              </a>
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up opacity-0 delay-400">
              {['TanStack Table v8', 'React 19', 'Tailwind CSS v4', 'TypeScript'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-card border text-sm font-medium text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-10 animate-fade-in-up opacity-0">
              <h2 className="text-3xl font-bold mb-3">Interactive Demo</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Experience all features in action. Try sorting, filtering, selecting rows, and editing cells directly.
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fade-in-up opacity-0 delay-100">
              <div className="inline-flex items-center p-1 rounded-xl bg-muted/50 border">
                <button
                  onClick={() => setIsServerSide(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    !isServerSide
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  <Monitor className="h-4 w-4" />
                  Client-Side
                </button>
                <button
                  onClick={() => setIsServerSide(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isServerSide
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  <Server className="h-4 w-4" />
                  Server-Side
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {isServerSide ? 'Simulated API calls with loading states' : 'All operations in the browser'}
              </span>
            </div>

            {/* Editing hint */}
            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground animate-fade-in-up opacity-0 delay-200">
              <Pencil className="w-4 h-4" />
              <span>
                <strong>Click</strong> First Name · <strong>Blur</strong> Last Name · <strong>Double-click</strong> Role
                & Status · <strong>Enter</strong> Notes
              </span>
            </div>

            {/* DataGrid */}
            <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-4 shadow-xl animate-fade-in-up opacity-0 delay-300">
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
                pageSize={5}
                pageSizeOptions={[5, 10, 15, 25]}
                enableCellEditing={true}
                defaultEditMode="click"
                onCellEdit={handleCellEdit}
                onCellEditError={handleCellEditError}
                manualPagination={isServerSide}
                manualSorting={isServerSide}
                manualFiltering={isServerSide}
                totalCount={isServerSide ? totalCount : undefined}
                pageCount={isServerSide ? pageCount : undefined}
                isLoading={isServerSide ? isLoading : false}
                onDataChange={isServerSide ? handleDataChange : undefined}
                cellContextMenuItems={cellContextMenuItems}
                headerContextMenuItems={headerContextMenuItems}
                enableCellContextMenu={true}
                enableHeaderContextMenu={true}
                aria-label="User management table"
              />
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section id="install" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 animate-fade-in-up opacity-0">
              <h2 className="text-3xl font-bold mb-3">Quick Installation</h2>
              <p className="text-muted-foreground">Add the DataGrid component to your project with a single command</p>
            </div>

            <div className="space-y-4 animate-fade-in-up opacity-0 delay-100">
              {/* Package manager tabs */}
              <div className="flex items-center">
                <div className="inline-flex items-center p-1 rounded-xl bg-muted/50 border">
                  {Object.keys(packageCommands).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setSelectedPackageManager(pm)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        selectedPackageManager === pm
                          ? 'bg-background shadow-sm text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}>
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terminal window */}
              <div className="relative">
                <div className="terminal-window rounded-xl overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                    <span className="ml-2 text-xs text-white/40 font-mono">terminal</span>
                  </div>

                  {/* Terminal content */}
                  <div className="p-5 flex items-center gap-3">
                    <code className="flex-1 font-mono text-sm text-emerald-400 overflow-x-auto">
                      <span className="text-white/40">$ </span>
                      {packageCommands[selectedPackageManager as keyof typeof packageCommands]}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                      {copiedCommand === selectedPackageManager ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Copied toast */}
                {copiedCommand === selectedPackageManager && (
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Check className="w-3 h-3" />
                      Copied to clipboard
                    </span>
                  </div>
                )}
              </div>

              <p className="text-center text-sm text-muted-foreground pt-4">
                Installs the DataGrid component and all dependencies into your project
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 animate-fade-in-up opacity-0">
              <h2 className="text-3xl font-bold mb-3">Everything You Need</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built with modern React patterns and fully typed with TypeScript
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="feature-card group relative bg-card rounded-2xl border p-6 animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-6 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-5 flex items-center justify-center">
                  <Table2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">DataGrid for shadcn/ui</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Built by</span>
                <a
                  href="https://github.com/abaktiar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:text-primary transition-colors">
                  @abaktiar
                </a>
                <span>&</span>
                <span className="font-medium text-foreground">AI</span>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>

              <a
                href="https://github.com/abaktiar/datagrid-shadcn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
