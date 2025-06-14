'use client';

import React, { useState } from 'react';
import { 
  DataGrid, 
  DataGridColumn,
  TextEditInput,
  NumberEditInput,
  SelectEditInput,
  CheckboxEditInput,
  DateEditInput,
  EmailEditInput,
  createSelectEditComponent,
  CellEditConfig
} from '../components/data-grid';

// Sample data type
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: string;
  isActive: boolean;
  joinDate: string;
  salary: number;
}

// Sample data
const initialData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    role: 'developer',
    isActive: true,
    joinDate: '2023-01-15',
    salary: 75000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 28,
    role: 'designer',
    isActive: true,
    joinDate: '2023-02-20',
    salary: 65000,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 35,
    role: 'manager',
    isActive: false,
    joinDate: '2022-11-10',
    salary: 85000,
  },
];

// Role options for select dropdown
const roleOptions = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'manager', label: 'Manager' },
  { value: 'qa', label: 'QA Engineer' },
];

// Create custom select component for roles
const RoleSelectInput = createSelectEditComponent<User>(roleOptions);

export function EditableDataGridExample() {
  const [data, setData] = useState<User[]>(initialData);

  // Handle cell edit - this would typically make an API call
  const handleCellEdit = async (value: any, row: any, column: any): Promise<boolean> => {
    try {
      console.log('Saving cell edit:', {
        rowId: row.id,
        columnId: column.id,
        oldValue: row.original[column.accessorKey],
        newValue: value,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local data optimistically
      setData(prevData => 
        prevData.map(item => 
          item.id === row.original.id 
            ? { ...item, [column.accessorKey]: value }
            : item
        )
      );

      return true; // Success
    } catch (error) {
      console.error('Failed to save:', error);
      return false; // Failure
    }
  };

  // Handle edit errors
  const handleCellEditError = (error: string, row: any, column: any) => {
    console.error('Edit error:', error, { row: row.original, column: column.id });
    // You could show a toast notification here
  };

  // Validation function for age
  const validateAge = (value: number): string | null => {
    if (value < 18) return 'Age must be at least 18';
    if (value > 100) return 'Age must be less than 100';
    return null;
  };

  // Validation function for salary
  const validateSalary = (value: number): string | null => {
    if (value < 0) return 'Salary cannot be negative';
    if (value > 1000000) return 'Salary seems too high';
    return null;
  };

  const columns: DataGridColumn<User>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      enableEditing: {
        enabled: true,
        mode: 'click',
        component: TextEditInput,
        placeholder: 'Enter name...',
        validate: (value: string) => {
          if (!value.trim()) return 'Name is required';
          if (value.length < 2) return 'Name must be at least 2 characters';
          return null;
        },
      },
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
      enableEditing: {
        enabled: true,
        mode: 'doubleClick',
        component: EmailEditInput,
        placeholder: 'Enter email...',
        validate: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return 'Invalid email format';
          return null;
        },
      },
    },
    {
      id: 'age',
      accessorKey: 'age',
      header: 'Age',
      enableEditing: {
        enabled: true,
        mode: 'click',
        component: NumberEditInput,
        validate: validateAge,
      },
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: 'Role',
      enableEditing: {
        enabled: true,
        mode: 'click',
        component: RoleSelectInput,
      },
      cell: ({ row }) => (
        <span className="capitalize">
          {roleOptions.find(opt => opt.value === row.original.role)?.label || row.original.role}
        </span>
      ),
    },
    {
      id: 'isActive',
      accessorKey: 'isActive',
      header: 'Active',
      enableEditing: {
        enabled: true,
        mode: 'click',
        component: CheckboxEditInput,
      },
      cell: ({ row }) => (
        <span className={row.original.isActive ? 'text-green-600' : 'text-red-600'}>
          {row.original.isActive ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      id: 'joinDate',
      accessorKey: 'joinDate',
      header: 'Join Date',
      enableEditing: {
        enabled: true,
        mode: 'click',
        component: DateEditInput,
      },
    },
    {
      id: 'salary',
      accessorKey: 'salary',
      header: 'Salary',
      enableEditing: {
        enabled: true,
        mode: 'doubleClick',
        component: NumberEditInput,
        validate: validateSalary,
        disabled: (row) => row.original.role === 'intern', // Interns can't edit salary
      },
      cell: ({ row }) => (
        <span>${row.original.salary.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Editable DataGrid Example</h2>
        <p className="text-muted-foreground">
          Click or double-click cells to edit them. Different columns have different edit modes and validation.
        </p>
      </div>

      <DataGrid
        data={data}
        columns={columns}
        enableCellEditing={true}
        defaultEditMode="click"
        onCellEdit={handleCellEdit}
        onCellEditError={handleCellEditError}
        enableRowSelection={true}
        enableSorting={true}
        enableGlobalFilter={true}
        enablePagination={true}
        pageSize={10}
      />

      <div className="text-sm text-muted-foreground space-y-1">
        <p><strong>Edit Modes:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Click:</strong> Name, Age, Role, Active, Join Date</li>
          <li><strong>Double-click:</strong> Email, Salary</li>
        </ul>
        <p><strong>Validation:</strong> Age (18-100), Email format, Name required, Salary positive</p>
        <p><strong>Disabled:</strong> Salary editing is disabled for interns</p>
      </div>
    </div>
  );
}
