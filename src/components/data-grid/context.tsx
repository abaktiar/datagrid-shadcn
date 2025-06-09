import { createContext, useContext } from 'react'
import { DataGridContextValue } from './types'

export const DataGridContext = createContext<DataGridContextValue<any> | null>(null)

export function useDataGrid<TData>() {
  const context = useContext(DataGridContext) as DataGridContextValue<TData> | null
  
  if (!context) {
    throw new Error('useDataGrid must be used within a DataGrid component')
  }
  
  return context
}
