# DataGrid Server-Side Operations Guide

## Overview

The DataGrid supports both client-side and server-side operations for sorting, pagination, filtering, and search. This guide shows how to implement both approaches.

## Client-Side Operations (Default)

By default, all operations are performed client-side:

```tsx
<DataGrid
  data={users}
  columns={columns}
  // Client-side is default - no additional props needed
  enableSorting={true}
  enablePagination={true}
  enableGlobalFilter={true}
  enableColumnFilters={true}
/>
```

## Server-Side Operations

### Basic Server-Side Setup

```tsx
import { useState, useEffect } from 'react';
import { DataGrid, DataChangeParams } from './components/data-grid';

function ServerSideDataGrid() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const handleDataChange = async (params: DataChangeParams) => {
    setLoading(true);
    try {
      const response = await fetchData({
        page: params.pagination.pageIndex,
        pageSize: params.pagination.pageSize,
        sortBy: params.sorting[0]?.id,
        sortOrder: params.sorting[0]?.desc ? 'desc' : 'asc',
        filters: params.filters,
        search: params.globalFilter,
      });
      
      setData(response.data);
      setTotalCount(response.totalCount);
      setPageCount(Math.ceil(response.totalCount / params.pagination.pageSize));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataGrid
      data={data}
      columns={columns}
      // Enable server-side operations
      manualPagination={true}
      manualSorting={true}
      manualFiltering={true}
      // Provide server-side data
      totalCount={totalCount}
      pageCount={pageCount}
      isLoading={loading}
      // Handle data changes
      onDataChange={handleDataChange}
      // Enable features
      enableSorting={true}
      enablePagination={true}
      enableGlobalFilter={true}
      enableColumnFilters={true}
    />
  );
}
```

### Mixed Mode (Some Client, Some Server)

You can mix client and server operations:

```tsx
<DataGrid
  data={data}
  columns={columns}
  // Server-side pagination and sorting
  manualPagination={true}
  manualSorting={true}
  // Client-side filtering
  manualFiltering={false}
  totalCount={totalCount}
  pageCount={pageCount}
  onDataChange={handleDataChange}
/>
```

## DataChangeParams Interface

The `onDataChange` callback receives comprehensive parameters:

```tsx
interface DataChangeParams {
  pagination: {
    pageIndex: number;    // 0-based page index
    pageSize: number;     // Number of rows per page
  };
  sorting: Array<{
    id: string;          // Column ID
    desc: boolean;       // Sort direction
  }>;
  filters: Array<{
    id: string;          // Column ID
    value: any;          // Filter value
  }>;
  globalFilter: string;  // Global search term
}
```

## Server-Side API Examples

### REST API Example

```tsx
async function fetchData(params) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortOrder && { sortOrder: params.sortOrder }),
    ...(params.search && { search: params.search }),
  });

  // Add filters
  params.filters.forEach((filter, index) => {
    queryParams.append(`filters[${index}][field]`, filter.id);
    queryParams.append(`filters[${index}][value]`, filter.value);
  });

  const response = await fetch(`/api/users?${queryParams}`);
  return response.json();
}
```

### GraphQL Example

```tsx
import { gql, useQuery } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers(
    $page: Int!
    $pageSize: Int!
    $sortBy: String
    $sortOrder: SortOrder
    $search: String
    $filters: [FilterInput!]
  ) {
    users(
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
      search: $search
      filters: $filters
    ) {
      data {
        id
        firstName
        lastName
        email
        role
        status
      }
      totalCount
      pageCount
    }
  }
`;

function ServerSideDataGrid() {
  const [params, setParams] = useState({
    page: 0,
    pageSize: 10,
    sortBy: null,
    sortOrder: null,
    search: '',
    filters: [],
  });

  const { data, loading, error } = useQuery(GET_USERS, {
    variables: params,
  });

  const handleDataChange = (newParams: DataChangeParams) => {
    setParams({
      page: newParams.pagination.pageIndex,
      pageSize: newParams.pagination.pageSize,
      sortBy: newParams.sorting[0]?.id || null,
      sortOrder: newParams.sorting[0]?.desc ? 'DESC' : 'ASC',
      search: newParams.globalFilter,
      filters: newParams.filters,
    });
  };

  return (
    <DataGrid
      data={data?.users?.data || []}
      columns={columns}
      manualPagination={true}
      manualSorting={true}
      manualFiltering={true}
      totalCount={data?.users?.totalCount}
      pageCount={data?.users?.pageCount}
      isLoading={loading}
      error={error?.message}
      onDataChange={handleDataChange}
    />
  );
}
```

## Performance Optimization

### Debounced Search

```tsx
import { useDebouncedCallback } from 'use-debounce';

function OptimizedDataGrid() {
  const [params, setParams] = useState(initialParams);

  const debouncedDataChange = useDebouncedCallback(
    (newParams: DataChangeParams) => {
      setParams(newParams);
    },
    300 // 300ms debounce for search
  );

  return (
    <DataGrid
      data={data}
      columns={columns}
      manualPagination={true}
      manualSorting={true}
      manualFiltering={true}
      onDataChange={debouncedDataChange}
    />
  );
}
```

### Caching

```tsx
import { useQuery } from '@tanstack/react-query';

function CachedDataGrid() {
  const [params, setParams] = useState(initialParams);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    keepPreviousData: true, // Keep previous data while loading new
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <DataGrid
      data={data?.users || []}
      columns={columns}
      manualPagination={true}
      totalCount={data?.totalCount}
      pageCount={data?.pageCount}
      isLoading={isLoading}
      onDataChange={setParams}
    />
  );
}
```

## Key Benefits

### Client-Side
- **Fast interactions**: No network requests for operations
- **Offline capable**: Works without server connection
- **Simple setup**: No backend changes needed
- **Rich filtering**: Complex client-side filters possible

### Server-Side
- **Large datasets**: Handle millions of records efficiently
- **Reduced memory**: Only load visible data
- **Real-time data**: Always fresh from server
- **Advanced search**: Database-powered search capabilities
- **Security**: Server-side filtering and validation

## Best Practices

1. **Use server-side for large datasets** (>10,000 rows)
2. **Debounce search input** to avoid excessive API calls
3. **Cache results** when possible to improve UX
4. **Show loading states** during data fetching
5. **Handle errors gracefully** with proper error messages
6. **Validate parameters** on the server side
7. **Use pagination** to limit data transfer
8. **Index database columns** used for sorting and filtering
