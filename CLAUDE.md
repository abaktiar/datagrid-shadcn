# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**datagrid-shadcn** is a feature-rich, composable data grid registry component built with TanStack Table v8, shadcn/ui, and Tailwind CSS v4. It's designed to be installed via `npx shadcn@latest add <registry-url>` into other projects.

**Live Demo:** https://abaktiar.github.io/datagrid-shadcn/
**Registry URL:** https://abaktiar.github.io/datagrid-shadcn/r/data-grid.json

## Commands

```bash
npm run dev              # Start Vite dev server (port 5173)
npm run build            # Build for production
npm run lint             # Run ESLint
npm run registry:build   # Build shadcn registry files to public/r/
```

## Architecture

### Component Structure

The DataGrid uses a composable architecture with React Context for state sharing:

```
DataGrid (orchestrator)
├── DataGridFilters      # Global search, column visibility
├── DataGridHeader       # Column headers, sorting, resizing
├── DataGridBody         # Row rendering (standard or virtualized)
├── DataGridPagination   # Page controls
└── DataGridActionDock   # Bulk actions for selected rows
```

All child components access state via `useDataGrid()` hook which provides the TanStack Table instance and configuration.

### State Management

All table state is managed by TanStack Table within the main `DataGrid` component:
- `rowSelection`, `sorting`, `columnFilters`, `globalFilter`, `pagination`
- `columnVisibility`, `columnSizing`, `editingCell`

The component supports both client-side and server-side operations. For server-side, use `manual*` props (`manualPagination`, `manualSorting`, `manualFiltering`) with the `onDataChange` callback.

### Cell Editing System

Cell editing is configured per-column via `enableEditing` which accepts `boolean | CellEditConfig`:
- **Edit behaviors:** Defined in `EditBehaviors` constant (clickToEdit, clickWithButtons, doubleClickToEdit)
- **Edit components:** Pre-built inputs in `edit-components.tsx` (TextEditInput, NumberEditInput, SelectEditInput, DateEditInput, EmailEditInput, CheckboxEditInput)
- **Presets:** Helper functions in `edit-presets.tsx` (createClickToEdit, createClickWithButtons, BehaviorBuilder)

### Context Menus

Context menu items are individual utility functions in `context-menu-utils.tsx`:
- **Cell menus:** `copyCellItem()`, `editCellItem()`, `deleteRowItem()`, etc.
- **Header menus:** `sortAscendingItem()`, `filterColumnItem()`, `hideColumnItem()`, `pinLeftItem()`, etc.

## Key Files

| File | Purpose |
|------|---------|
| `src/components/data-grid/data-grid.tsx` | Main component, state setup, TanStack Table config |
| `src/components/data-grid/types.ts` | TypeScript interfaces (DataGridProps, DataGridColumn, CellEditConfig) |
| `src/components/data-grid/index.ts` | Public exports |
| `src/App.tsx` | Comprehensive demo with all features |

## Tech Stack

- **React 19** + **TypeScript** with strict mode
- **TanStack Table v8** for headless table logic
- **TanStack Virtual** for row virtualization
- **shadcn/ui** components (Radix primitives)
- **Tailwind CSS v4** with CSS variables for theming
- **Vite** for bundling

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig and vite.config)
