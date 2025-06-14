# Cell Editing

The DataGrid supports powerful inline cell editing with maximum developer control. Configure exactly how, when, and where users can edit cells with flexible behaviors, validation, custom input components, and both client-side and server-side persistence.

## Quick Start

Enable cell editing by setting `enableCellEditing={true}` on the DataGrid and configuring `enableEditing` on individual columns:

```tsx
import { DataGrid, EditPresets } from '@/components/ui/data-grid';

const columns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    enableEditing: EditPresets.text.required<User>(), // Pre-configured with validation
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableEditing: true, // Simple boolean enables basic editing
  },
];
```

## Flexible Behavior System

The new editing system gives you complete control over how editing works:

### Edit Behaviors

Control exactly when and how cells are saved or canceled:

```tsx
import { BehaviorBuilder, EditBehaviors } from '@/components/ui/data-grid';

// Pre-configured behaviors
{
  enableEditing: {
    enabled: true,
    behavior: EditBehaviors.clickToEdit,        // Click to edit, save on blur/enter
    behavior: EditBehaviors.clickWithButtons,   // Click to edit, manual save/cancel buttons
    behavior: EditBehaviors.doubleClickToEdit,  // Double-click to edit
    behavior: EditBehaviors.alwaysEdit,         // Always in edit mode, save immediately
    behavior: EditBehaviors.manual,             // Full manual control
  }
}

// Custom behavior with fluent API
{
  enableEditing: {
    enabled: true,
    behavior: BehaviorBuilder.create()
      .doubleClickToEdit()           // Trigger: double-click
      .withActionButtons()           // Show save/cancel buttons
      .saveOnEnter()                 // Also save on Enter key
      .noTextSelection()             // Don't select all text on focus
      .build(),
    component: TextEditInput,
  }
}
```

### Save/Cancel Triggers

Configure exactly when changes are saved or canceled:

- **`blur`** - Save when input loses focus
- **`enter`** - Save when Enter key is pressed
- **`escape`** - Cancel when Escape key is pressed
- **`manual`** - Only save/cancel via buttons or API calls
- **`immediate`** - Save immediately on every change

### Edit Modes

Control how editing is triggered:

- **`click`** - Single click to start editing
- **`doubleClick`** - Double-click to start editing
- **`always`** - Cell is always in edit mode
- **`manual`** - Programmatic control only

```tsx
import { DataGrid, TextEditInput } from '@/components/ui/data-grid';

const columns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    enableEditing: true, // Simple boolean enables editing with default settings
  },
  {
    id: 'email',
    accessorKey: 'email', 
    header: 'Email',
    enableEditing: {
      enabled: true,
      mode: 'doubleClick',
      component: EmailEditInput,
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Invalid email format';
      },
    },
  },
];

<DataGrid
  data={data}
  columns={columns}
  enableCellEditing={true}
  defaultEditMode="click"
  onCellEdit={handleCellEdit}
  onCellEditError={handleCellEditError}
/>
```

## Edit Modes

### Click Mode (`'click'`)
- Single click to start editing
- Best for frequently edited cells

### Double-Click Mode (`'doubleClick'`)
- Double-click to start editing  
- Prevents accidental edits
- Good for important data

### Always Mode (`'always'`)
- Cell is always in edit mode
- No click required
- Useful for forms or always-editable fields

## Built-in Input Components

### TextEditInput
```tsx
{
  enableEditing: {
    component: TextEditInput,
    placeholder: 'Enter text...',
  }
}
```

### NumberEditInput
```tsx
{
  enableEditing: {
    component: NumberEditInput,
    validate: (value) => value >= 0 ? null : 'Must be positive',
  }
}
```

### SelectEditInput
```tsx
import { createSelectEditComponent } from '@/components/ui/data-grid';

const StatusSelect = createSelectEditComponent([
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]);

{
  enableEditing: {
    component: StatusSelect,
  }
}
```

### CheckboxEditInput
```tsx
{
  enableEditing: {
    component: CheckboxEditInput,
  }
}
```

### DateEditInput
```tsx
{
  enableEditing: {
    component: DateEditInput,
  }
}
```

### EmailEditInput
```tsx
{
  enableEditing: {
    component: EmailEditInput,
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email',
  }
}
```

## Custom Input Components

Create custom input components by implementing the `CellEditComponentProps` interface:

```tsx
import { CellEditComponentProps } from '@/components/ui/data-grid';

function CustomInput<TData>({
  value,
  onChange,
  onSave,
  onCancel,
  row,
  column,
  placeholder,
  disabled,
  autoFocus,
}: CellEditComponentProps<TData, string>) {
  const [inputValue, setInputValue] = useState(value || '');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange(inputValue);
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => { onChange(inputValue); onSave(); }}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
    />
  );
}
```

## Validation

Add client-side validation with the `validate` function:

```tsx
{
  enableEditing: {
    validate: (value, row) => {
      if (!value) return 'Required field';
      if (value.length < 3) return 'Must be at least 3 characters';
      if (someCondition(row)) return 'Invalid for this row';
      return null; // Valid
    },
  }
}
```

## Server-Side Persistence

Handle saving with the `onCellEdit` callback:

```tsx
const handleCellEdit = async (value, row, column) => {
  try {
    // Make API call
    const response = await fetch(`/api/users/${row.original.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [column.accessorKey]: value,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save');
    }

    // Update local state optimistically
    updateLocalData(row.original.id, column.accessorKey, value);
    
    return true; // Success
  } catch (error) {
    console.error('Save failed:', error);
    return false; // Failure - will show error
  }
};
```

## Column-Specific Save Handlers

Override the global save handler for specific columns:

```tsx
{
  enableEditing: {
    onSave: async (value, row, column) => {
      // Custom save logic for this column
      return await saveSpecialField(value, row.original.id);
    },
  }
}
```

## Conditional Editing

Disable editing based on row data:

```tsx
{
  enableEditing: {
    disabled: (row) => row.original.status === 'locked',
  }
}
```

## Error Handling

Handle edit errors globally:

```tsx
const handleCellEditError = (error, row, column) => {
  toast.error(`Failed to save ${column.id}: ${error}`);
  // Log to analytics, etc.
};

<DataGrid onCellEditError={handleCellEditError} />
```

## Complete Configuration Example

```tsx
const editConfig: CellEditConfig<User> = {
  enabled: true,
  mode: 'click',
  component: TextEditInput,
  placeholder: 'Enter value...',
  validate: (value, row) => {
    if (!value) return 'Required';
    return null;
  },
  onSave: async (value, row, column) => {
    return await saveToServer(value, row.original.id, column.id);
  },
  onCancel: (row, column) => {
    console.log('Edit cancelled');
  },
  disabled: (row) => row.original.readonly,
};
```

## Keyboard Shortcuts

- **Enter**: Save changes
- **Escape**: Cancel changes  
- **Tab**: Save and move to next cell (if implemented)

## Best Practices

1. **Use appropriate edit modes**: Click for frequent edits, double-click for important data
2. **Add validation**: Always validate user input
3. **Handle errors gracefully**: Provide clear error messages
4. **Optimize for UX**: Use placeholders, auto-focus, and clear visual feedback
5. **Consider performance**: For large datasets, implement debounced saving
6. **Test thoroughly**: Ensure editing works across different browsers and devices
