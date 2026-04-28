import { DataGridLabels } from './types';

export const defaultLabels: Required<DataGridLabels> = {
  search: 'Search all columns...',
  view: 'View',
  toggleColumns: 'Toggle columns',
  rowsPerPage: 'Rows per page',
  page: (current, total) => `Page ${current} of ${total}`,
  rowRange: (start, end, total) => `${start}-${end} of ${total}`,
  selected: (n, total) => `${n} of ${total} row(s) selected.`,
  noData: 'No data available',
  loading: 'Loading...',
  error: (message) => `Error: ${message}`,
  firstPage: 'Go to first page',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  lastPage: 'Go to last page',
  selectAll: 'Select all rows',
  selectRow: (index) => `Select row ${index + 1}`,
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  clearSelection: 'Clear selection',
  more: 'More',
  filter: 'Filter',
  apply: 'Apply',
  clear: 'Clear',
  density: 'Density',
  densityCompact: 'Compact',
  densityNormal: 'Normal',
  densityComfortable: 'Comfortable',
  export: 'Export',
  exportCsv: 'Export CSV',
  exportJson: 'Export JSON',
  exportSelected: 'Export selected',
  exportAll: 'Export all',
};

export function mergeLabels(overrides?: DataGridLabels): Required<DataGridLabels> {
  if (!overrides) return defaultLabels;
  return { ...defaultLabels, ...overrides };
}
