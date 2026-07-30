

# Componente DataGrid de shadcn/ui

Un componente de grilla de datos (datagrid) rico en características y componible, construido con TanStack Table v8, shadcn/ui y Tailwind CSS v4. Esta implementación sigue el exhaustivo Documento de Requisitos del Producto (PRD) para crear una grilla de datos de alto rendimiento, accesible y personalizable.

## 🚀 Demo en Vivo

Consulta la demo en vivo aquí: [https://abaktiar.github.io/datagrid-shadcn/](https://abaktiar.github.io/datagrid-shadcn/)

## 📦 Instalación

### Usando shadcn CLI (Recomendado)

Instala el componente DataGrid directamente en tu proyecto:

```bash
npx shadcn@latest add https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json
```

### Gestores de Paquetes Alternativos

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

### Instalación Manual

Si prefieres instalar manualmente:

1. Instala las dependencias:
```bash
npm install @tanstack/react-table @tanstack/react-virtual lucide-react class-variance-authority clsx tailwind-merge
```

2. Instala los componentes de shadcn requeridos:
```bash
npx shadcn@latest add button checkbox input select context-menu dropdown-menu
```

3. Copia los archivos del componente data-grid desde este repositorio a tu proyecto.

## 🚀 Despliegue del Registro (Registry)

### Registro en Vivo

El componente DataGrid está desplegado y disponible en:
```
https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json
```

### Construir el Registro Localmente

```bash
npm run registry:build
```

Esto genera archivos de registro en `public/r/` que pueden ser consumidos por la CLI de shadcn.

### Desplega Tu Propio Registro

1. Construye el registro:
```bash
npm run registry:build
```

2. Despliega tu proyecto en Vercel, Netlify o cualquier servicio de alojamiento estático

3. Tu registro estará disponible en:
```
https://your-domain.com/r/data-grid.json
```

## 🧪 Desarrollo Local

Para probar el registro localmente:

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. En otro proyecto, instala desde el servidor local:
```bash
npx shadcn@latest add http://localhost:5173/r/data-grid.json
```

## 🚀 Características

### Funcionalidad Principal
- ✅ **Ordenamiento Avanzado** - Ordenamiento por una o múltiples columnas con indicadores visuales
- ✅ **Filtrado Inteligente** - Búsqueda global y filtrado específico por columna
- ✅ **Selección de Filas** - Selección múltiple de filas con casillas de verificación y estados indeterminados
- ✅ **Acciones Contextuales** - Dock de acciones dinámicas para operaciones masivas en filas seleccionadas
- ✅ **Paginación** - Soporte para paginación del lado del cliente y del servidor
- ✅ **Gestión de Columnas** - Mostrar/ocultar columnas, redimensionamiento de columnas (habilitado por defecto y configurable)
- ✅ **Virtualización de Filas** - Optimización de rendimiento para conjuntos de datos grandes
- ✅ **Edición de Celdas en Línea** - Edita datos directamente en las celdas, con soporte para varios tipos de entrada, validación y comportamientos configurables
- ✅ **Menús Contextuales Personalizables** - Agrega menús con clic derecho a celdas y encabezados, utilizando utilidades predefinidas o elementos personalizados para acciones a medida
- ✅ **Accesibilidad** - Cumple con WCAG con navegación completa por teclado

### Características Técnicas
- 🎨 **Diseño Componible** - Construido con principios de shadcn/ui para máxima personalización
- ⚡ **Alto Rendimiento** - Renderizado optimizado con TanStack Table y Virtual
- 🎯 **Soporte para TypeScript** - Totalmente tipado con interfaces completas
- 📱 **Diseño Responsivo** - Optimizado para móviles con Tailwind CSS v4
- ♿ **Accesibilidad Primero** - Atributos ARIA y navegación por teclado

## 🛠️ Stack Tecnológico

- **TanStack Table v8** - Lógica de tabla headless y gestión de estado
- **shadcn/ui** - Componentes de UI componibles
- **Tailwind CSS v4** - Estilos primero en utilidades con características modernas de CSS
- **TanStack Virtual** - Virtualización de filas para conjuntos de datos grandes
- **React 19** - Características más recientes de React
- **TypeScript** - Seguridad de tipos y experiencia de desarrollo
- **Vite** - Herramienta de compilación rápida y servidor de desarrollo

## 📦 Instalación

```bash
# Clone the repository
git clone <repository-url>
cd datagrid-shadcn

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Uso

### Ejemplo Básico

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

### Características Avanzadas

#### Renderizadores de Celdas Personalizados

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

#### Operaciones del Lado del Servidor

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

#### Virtualización de Filas

```tsx
<DataGrid
  data={largeDataset}
  columns={columns}
  enableVirtualization={true}
  estimateSize={50} // Estimated row height in pixels
/>
```

## 📋 Referencia de la API

### Props de DataGrid

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | - | Array de objetos de datos a mostrar |
| `columns` | `DataGridColumn<TData>[]` | - | Definiciones de columnas |
| `actions` | `DataGridAction<TData>[]` | `[]` | Acciones masivas para filas seleccionadas |
| `enableRowSelection` | `boolean` | `false` | Habilita la selección de filas con casillas de verificación |
| `enableMultiRowSelection` | `boolean` | `true` | Permite la selección de múltiples filas |
| `onRowSelectionChange` | `(selectedRows: Row<TData>[]) => void` | `undefined` | Callback cuando cambia la selección de filas. |
| `enableSorting` | `boolean` | `true` | Habilita el ordenamiento de columnas |
| `enableMultiSort` | `boolean` | `false` | Permite ordenar por múltiples columnas |
| `manualSorting` | `boolean` | `false` | Establece en `true` si el ordenamiento se maneja externamente (lado del servidor). Requiere `onSortingChange` o `onDataChange`. |
| `onSortingChange` | `(sorting: any[]) => void` | `undefined` | Callback cuando cambia el estado de ordenamiento. Se usa con `manualSorting`. |
| `enableGlobalFilter` | `boolean` | `true` | Habilita el filtro de búsqueda global |
| `enableColumnFilters` | `boolean` | `true` | Habilita el filtrado por columna |
| `manualFiltering` | `boolean` | `false` | Establece en `true` si el filtrado (global y por columna) se maneja externamente (lado del servidor). Requiere `onGlobalFilterChange`, `onColumnFiltersChange` o `onDataChange`. |
| `onGlobalFilterChange` | `(globalFilter: string) => void` | `undefined` | Callback cuando cambia el valor del filtro global. Se usa con `manualFiltering`. |
| `onColumnFiltersChange` | `(columnFilters: any[]) => void` | `undefined` | Callback cuando cambian los filtros de columna. Se usa con `manualFiltering`. |
| `onDataChange` | `(params: DataChangeParams) => void` | `undefined` | Callback unificado para operaciones del lado del servidor cuando cambian la paginación, el ordenamiento o el filtrado. Consulta la interfaz `DataChangeParams`. |
| `enablePagination` | `boolean` | `true` | Habilita la paginación |
| `pageSize` | `number` | `10` | Número de filas por página |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Opciones de tamaño de página disponibles |
| `manualPagination` | `boolean` | `false` | Establece en `true` si la paginación se maneja externamente (lado del servidor). Requiere `pageCount` y `onPaginationChange` o `onDataChange`. |
| `pageCount` | `number` | `undefined` | Número total de páginas, requerido para `manualPagination`. |
| `totalCount` | `number` | `undefined` | Número total de registros en el conjunto de datos, útil para la visualización con paginación del lado del servidor. |
| `onPaginationChange` | `(pageIndex: number, pageSize: number) => void` | `undefined` | Callback cuando cambia el estado de paginación (índice de página o tamaño). Se usa con `manualPagination`. |
| `enableVirtualization` | `boolean` | `false` | Habilita la virtualización de filas para conjuntos de datos grandes |
| `estimateSize` | `number` | `35` | Altura estimada de fila para virtualización |
| `isLoading` | `boolean` | `false` | Muestra el estado de carga |
| `error` | `string \| null` | `null` | Mensaje de error a mostrar |
| `enableCellEditing` | `boolean` | `false` | Interruptor principal para habilitar/deshabilitar la edición de celdas. |
| `defaultEditMode` | `CellEditMode` | `'click'` | Modo predeterminado para activar la edición de celdas (p. ej., 'click', 'doubleClick'). |
| `onCellEdit` | `(value: any, row: Row<TData>, column: Column<TData>) => Promise<boolean> \| boolean` | `undefined` | Callback cuando el valor de una celda se edita y guarda correctamente. Devuelve `false` para indicar fallo en el guardado. |
| `onCellEditError` | `(error: string, row: Row<TData>, column: Column<TData>) => void` | `undefined` | Callback cuando ocurre un error durante la edición de una celda. |
| `enableCellContextMenu` | `boolean` | `false` | Habilita menús contextuales con clic derecho en celdas de datos. |
| `enableHeaderContextMenu` | `boolean` | `false` | Habilita menús contextuales con clic derecho en encabezados de columna. |
| `cellContextMenuItems` | `CellContextMenuItem<TData>[]` | `[]` | Array de elementos para menús contextuales de celdas. |
| `headerContextMenuItems` | `HeaderContextMenuItem<TData>[]` | `[]` | Array de elementos para menús contextuales de encabezados. |
| `enableColumnResizing` | `boolean` | `true` | Habilita/deshabilita el redimensionamiento de columnas para toda la grilla. |
| `onColumnSizingChange` | `(columnSizing: Record<string, number>) => void` | `undefined` | Callback cuando cambian los tamaños de columna debido al redimensionamiento. |
| `className` | `string` | `undefined` | Nombre de clase CSS personalizado para el contenedor principal de DataGrid. |
| `'aria-label'` | `string` | `'Data grid'` |  Etiqueta ARIA para la región de DataGrid. |
| `'aria-describedby'` | `string` | `undefined` | Atributo ARIA describedby para la región de DataGrid. |

### Interfaz DataGridColumn

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

### Interfaz DataGridAction

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

### Interfaz DataChangeParams
Esta interfaz define el objeto que se pasa al callback `onDataChange`, utilizado para operaciones de datos del lado del servidor.

| Property     | Type                                  | Description                                                                 |
|--------------|---------------------------------------|-----------------------------------------------------------------------------|
| `pagination` | `{ pageIndex: number; pageSize: number }` | Contiene el índice y tamaño de página actuales.                               |
| `sorting`    | `Array<{ id: string; desc: boolean }>` | Array de objetos de ordenamiento, cada uno con un `id` de columna y una bandera `desc` (descendente). |
| `filters`    | `Array<{ id:string; value: any }>`    | Array de objetos de filtro de columna, cada uno con un `id` de columna y un valor de filtro `value`.   |
| `globalFilter` | `string`                              | La cadena actual del filtro global.                                           |

### Interfaz CellEditConfig<TData>
Se utiliza para configurar el comportamiento de edición de celdas para una columna a través de la prop `DataGridColumn.enableEditing`.

| Property      | Type                                                                 | Description                                                                                                                              |
|---------------|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `enabled`     | `boolean`                                                            | Si la edición está habilitada para esta columna.                                                                                                |
| `behavior`    | `CellEditBehavior`                                                   | Define cómo se activa y guarda la edición (p. ej., 'click', 'doubleClick', guardar al perder foco/enter). Consulta `EditBehaviors` en `types.ts`.        |
| `component`   | `ComponentType<CellEditComponentProps<TData, TValue>>`               | Componente React personalizado para el editor de celdas. Predeterminado: entrada de texto. Consulta `edit-components.tsx` para más.                          |
| `validate`    | `(value: TValue, row: Row<TData>) => string \| null`                   | Función para validar el valor editado. Devuelve una cadena de error o `null`.                                                                 |
| `onSave`      | `(value: TValue, row: Row<TData>, column: Column<TData>) => Promise<boolean> \| boolean` | Callback cuando se guarda una edición para esta columna específica. Anula `onCellEdit` global para esta columna si se proporciona. Devuelve `false` en caso de fallo. |
| `placeholder` | `string`                                                             | Texto marcador de posición para la entrada de edición.                                                                                                   |
| `disabled`    | `(row: Row<TData>) => boolean`                                       | Función para deshabilitar condicionalmente la edición para filas específicas.                                                                             |

*Nota: Para opciones más avanzadas de `CellEditConfig` como `onCancel`, `onEditStart`, `onEditEnd` y `EditBehaviors`, consulta `src/components/data-grid/types.ts` y la implementación de edición de celdas.*

### Interfaz CellContextMenuItem<TData>
Define un elemento para un menú contextual de celda, utilizado con la prop `cellContextMenuItems`.

| Property    | Type                                                              | Description                                                            |
|-------------|-------------------------------------------------------------------|------------------------------------------------------------------------|
| `id`        | `string`                                                          | ID único para el elemento del menú.                                           |
| `label`     | `string`                                                          | Texto mostrado para el elemento del menú.                                      |
| `icon`      | `ReactNode`                                                       | Icono opcional para mostrar junto a la etiqueta.                            |
| `onClick`   | `(row: Row<TData>, column: Column<TData>, value: any) => void \| Promise<void>` | Función que se llama cuando se hace clic en el elemento.                              |
| `isEnabled` | `(row: Row<TData>, column: Column<TData>, value: any) => boolean` | Función opcional para determinar si el elemento está habilitado.                 |
| `isVisible` | `(row: Row<TData>, column: Column<TData>, value: any) => boolean` | Función opcional para determinar si el elemento es visible.                 |
| `separator` | `boolean`                                                         | Si es `true`, renderiza un separador en lugar de un elemento clickeable.            |
| `variant`   | `'default' \| 'destructive'`                                      | Variante opcional, p. ej., para acciones destructivas.                     |

*Consejo: Las funciones utilitarias en `src/components/data-grid/context-menu-utils.tsx` (como `copyCellItem()`) proporcionan objetos `CellContextMenuItem` preconfigurados.*

### Interfaz HeaderContextMenuItem<TData>
Define un elemento para un menú contextual de encabezado, utilizado con la prop `headerContextMenuItems`.

| Property    | Type                                                     | Description                                                            |
|-------------|----------------------------------------------------------|------------------------------------------------------------------------|
| `id`        | `string`                                                 | ID único para el elemento del menú.                                           |
| `label`     | `string`                                                 | Texto mostrado para el elemento del menú.                                      |
| `icon`      | `ReactNode`                                              | Icono opcional para mostrar junto a la etiqueta.                            |
| `onClick`   | `(column: Column<TData>) => void \| Promise<void>`       | Función que se llama cuando se hace clic en el elemento.                              |
| `isEnabled` | `(column: Column<TData>) => boolean`                     | Función opcional para determinar si el elemento está habilitado.                 |
| `isVisible` | `(column: Column<TData>) => boolean`                     | Función opcional para determinar si el elemento es visible.                 |
| `separator` | `boolean`                                                | Si es `true`, renderiza un separador en lugar de un elemento clickeable.            |
| `variant`   | `'default' \| 'destructive'`                             | Variante opcional, p. ej., para acciones destructivas.                     |

*Consejo: Las funciones utilitarias en `src/components/data-grid/context-menu-utils.tsx` (como `sortAscendingItem()`) proporcionan objetos `HeaderContextMenuItem` preconfigurados.*

## 🏗️ Arquitectura

El componente DataGrid sigue una arquitectura componible con una clara separación de responsabilidades:

### Componentes Principales

- **DataGrid** - Componente contenedor principal que orquesta toda la funcionalidad
- **DataGridHeader** - Maneja los encabezados de columna, indicadores de ordenamiento y redimensionamiento
- **DataGridBody** - Renderiza las filas de la tabla con soporte para virtualización
- **DataGridPagination** - Controles de paginación y selección de tamaño de página
- **DataGridFilters** - Controles de búsqueda global y visibilidad de columnas
- **DataGridActionDock** - Acciones contextuales para filas seleccionadas

### Gestión de Estado

El componente utiliza la gestión de estado integrada de TanStack Table para:
- Estado de selección de filas
- Estado de ordenamiento
- Estado de filtrado
- Estado de paginación
- Visibilidad y tamaño de columnas

### Optimizaciones de Rendimiento

- **Memoización** - React.memo y useMemo para evitar re-renderizaciones innecesarias
- **Virtualización** - TanStack Virtual para manejar conjuntos de datos grandes
- **Filtrado con Retardo (Debouncing)** - Manejo optimizado de entradas de búsqueda
- **Actualizaciones Eficientes** - Manipulaciones mínimas del DOM a través de TanStack Table

## 🎨 Personalización

### Estilos

El componente es totalmente personalizable utilizando clases de Tailwind CSS. Todo el estilizado se aplica a través de clases de utilidad, lo que facilita modificar la apariencia:

```tsx
<DataGrid
  className="custom-datagrid"
  // ... other props
/>
```

### Soporte de Temas

El componente admite tanto temas claros como oscuros a través de variables de Tailwind CSS definidas en `src/index.css`.

### Componentes Personalizados

Puedes reemplazar cualquier subcomponente creando tu propia implementación:

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

## ♿ Accesibilidad

El componente DataGrid está construido con la accesibilidad en mente:

- **Atributos ARIA** - Roles, etiquetas y descripciones adecuados
- **Navegación por Teclado** - Soporte completo de teclado para todas las interacciones
- **Soporte para Lectores de Pantalla** - Marcado semántico y anuncios
- **Gestión de Enfoque** - Orden lógico de tabs e indicadores de enfoque
- **Alto Contraste** - Soporte para temas de alto contraste

### Atajos de Teclado

| Tecla | Acción |
|-----|--------|
| `Tab` / `Shift+Tab` | Navegar entre elementos interactivos |
| `Space` | Alternar selección de fila |
| `Enter` | Activar botones y enlaces |
| `Flechas` | Navegar dentro de menús desplegados |
| `Escape` | Cerrar menús desplegados |

## 🧪 Pruebas

El componente incluye una configuración exhaustiva de pruebas:

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📁 Estructura del Proyecto

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

## 🤝 Contribuciones

1. Haz un fork del repositorio
2. Crea una rama de características (`git checkout -b feature/amazing-feature`)
3. Commit de tus cambios (`git commit -m 'Añadir una característica increíble'`)
4. Envía a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [TanStack Table](https://tanstack.com/table) - Por la excelente biblioteca de tablas headless
- [shadcn/ui](https://ui.shadcn.com/) - Por los hermosos y componibles componentes de UI
- [Tailwind CSS](https://tailwindcss.com/) - Por el framework CSS primero en utilidades
- [Lucide React](https://lucide.dev/) - Por los hermosos iconos
