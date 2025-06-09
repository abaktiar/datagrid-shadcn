import { useMemo } from 'react'
import { Trash2, Download, CheckCircle, Archive, User, Mail, Calendar, Edit } from 'lucide-react'
import { DataGrid, DataGridColumn, DataGridAction } from '../components/data-grid'

// Example data interface
interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  lastUpdated: string
}

// Sample product data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 25,
    status: 'in-stock',
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Coffee Mug',
    category: 'Kitchen',
    price: 12.99,
    stock: 5,
    status: 'low-stock',
    lastUpdated: '2024-01-14T16:45:00Z',
  },
  {
    id: '3',
    name: 'Laptop Stand',
    category: 'Office',
    price: 45.00,
    stock: 0,
    status: 'out-of-stock',
    lastUpdated: '2024-01-10T08:15:00Z',
  },
  // Add more sample data as needed
]

export function BasicDataGridExample() {
  // Define columns for the product data
  const columns: DataGridColumn<Product>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Product Name',
      accessorKey: 'name',
      enableSorting: true,
      enableFiltering: true,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessorKey: 'category',
      enableSorting: true,
      enableFiltering: true,
    },
    {
      id: 'price',
      header: 'Price',
      accessorKey: 'price',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-right font-mono">
          ${row.original.price.toFixed(2)}
        </div>
      ),
    },
    {
      id: 'stock',
      header: 'Stock',
      accessorKey: 'stock',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.stock}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      enableSorting: true,
      enableFiltering: true,
      cell: ({ row }) => {
        const status = row.original.status
        const statusColors = {
          'in-stock': 'bg-green-100 text-green-800',
          'low-stock': 'bg-yellow-100 text-yellow-800',
          'out-of-stock': 'bg-red-100 text-red-800',
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status.replace('-', ' ')}
          </span>
        )
      },
    },
    {
      id: 'lastUpdated',
      header: 'Last Updated',
      accessorKey: 'lastUpdated',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(row.original.lastUpdated).toLocaleDateString()}</span>
        </div>
      ),
    },
  ], [])

  // Define actions for selected rows
  const actions: DataGridAction<Product>[] = useMemo(() => [
    {
      id: 'edit',
      label: 'Edit Selected',
      icon: <Edit className="h-4 w-4" />,
      variant: 'default',
      onClick: (selectedRows) => {
        const productNames = selectedRows.map(row => row.original.name)
        alert(`Edit products: ${productNames.join(', ')}`)
      },
      isEnabled: (selectedRows) => selectedRows.length > 0,
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      onClick: (selectedRows) => {
        const productNames = selectedRows.map(row => row.original.name)
        if (confirm(`Are you sure you want to delete ${selectedRows.length} product(s)?`)) {
          alert(`Delete products: ${productNames.join(', ')}`)
        }
      },
      isEnabled: (selectedRows) => selectedRows.length > 0,
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: <Download className="h-4 w-4" />,
      variant: 'outline',
      onClick: (selectedRows) => {
        const data = selectedRows.map(row => row.original)
        console.log('Exporting products:', data)
        alert(`Exported ${selectedRows.length} products to CSV`)
      },
      isEnabled: (selectedRows) => selectedRows.length > 0,
    },
    {
      id: 'restock',
      label: 'Mark as In Stock',
      icon: <CheckCircle className="h-4 w-4" />,
      variant: 'secondary',
      onClick: (selectedRows) => {
        const productNames = selectedRows.map(row => row.original.name)
        alert(`Mark as in stock: ${productNames.join(', ')}`)
      },
      isEnabled: (selectedRows) => selectedRows.some(row => row.original.status !== 'in-stock'),
    },
  ], [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Product Inventory</h2>
        <p className="text-muted-foreground">
          Manage your product inventory with advanced filtering, sorting, and bulk actions.
        </p>
      </div>

      <DataGrid
        data={sampleProducts}
        columns={columns}
        actions={actions}
        enableRowSelection={true}
        enableMultiRowSelection={true}
        enableSorting={true}
        enableMultiSort={false}
        enableGlobalFilter={true}
        enableColumnFilters={true}
        enablePagination={true}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        aria-label="Product inventory table"
      />
    </div>
  )
}

export function MinimalDataGridExample() {
  const simpleData = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ]

  const simpleColumns: DataGridColumn<any>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Minimal Example</h2>
        <p className="text-muted-foreground">
          A simple DataGrid with minimal configuration.
        </p>
      </div>

      <DataGrid
        data={simpleData}
        columns={simpleColumns}
        enableRowSelection={false}
        enableSorting={false}
        enableGlobalFilter={false}
        enablePagination={false}
      />
    </div>
  )
}
