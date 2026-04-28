import { Table } from '@tanstack/react-table';
import { isMetaColumn } from './types';

export interface ExportOptions {
  fileName?: string;
  selectedOnly?: boolean;
  visibleColumnsOnly?: boolean;
  includeHeader?: boolean;
}

function getRowsToExport<TData>(table: Table<TData>, selectedOnly: boolean) {
  if (selectedOnly) return table.getFilteredSelectedRowModel().rows;
  return table.getFilteredRowModel().rows;
}

function getExportColumns<TData>(table: Table<TData>, visibleOnly: boolean) {
  const cols = visibleOnly ? table.getVisibleLeafColumns() : table.getAllLeafColumns();
  return cols.filter((c) => !isMetaColumn(c.id));
}

function escapeCsvValue(value: any): string {
  if (value == null) return '';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadFile(content: string, fileName: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV<TData>(table: Table<TData>, options: ExportOptions = {}) {
  const {
    fileName = 'data-grid-export.csv',
    selectedOnly = false,
    visibleColumnsOnly = true,
    includeHeader = true,
  } = options;

  const rows = getRowsToExport(table, selectedOnly);
  const cols = getExportColumns(table, visibleColumnsOnly);

  const headerLine = cols
    .map((c) => {
      const header = c.columnDef.header;
      const text = typeof header === 'string' ? header : c.id;
      return escapeCsvValue(text);
    })
    .join(',');

  const lines: string[] = [];
  if (includeHeader) lines.push(headerLine);

  for (const row of rows) {
    const line = cols.map((c) => escapeCsvValue(row.getValue(c.id))).join(',');
    lines.push(line);
  }

  downloadFile(lines.join('\n'), fileName, 'text/csv;charset=utf-8;');
}

export function exportToJSON<TData>(table: Table<TData>, options: ExportOptions = {}) {
  const { fileName = 'data-grid-export.json', selectedOnly = false, visibleColumnsOnly = true } = options;

  const rows = getRowsToExport(table, selectedOnly);
  const cols = getExportColumns(table, visibleColumnsOnly);

  const payload = rows.map((row) => {
    const obj: Record<string, any> = {};
    for (const c of cols) {
      obj[c.id] = row.getValue(c.id);
    }
    return obj;
  });

  downloadFile(JSON.stringify(payload, null, 2), fileName, 'application/json');
}

export function copySelectionAsTSV(values: any[][]) {
  const tsv = values
    .map((row) =>
      row
        .map((v) => {
          if (v == null) return '';
          const str = typeof v === 'object' ? JSON.stringify(v) : String(v);
          return str.replace(/\t/g, ' ').replace(/\n/g, ' ');
        })
        .join('\t')
    )
    .join('\n');

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(tsv);
  }
  return tsv;
}
