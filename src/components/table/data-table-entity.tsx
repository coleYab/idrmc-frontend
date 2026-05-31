'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';

interface EntityTableProps<T extends Record<string, unknown>> {
  data: T[];
  totalItems: number;
  columns: ColumnDef<T>[];
  basePath: string;
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
}

export function EntityTable<T extends Record<string, unknown>>({
  data,
  totalItems,
  columns,
  basePath,
  searchFields,
  searchPlaceholder = 'Search...'
}: EntityTableProps<T>) {
  const router = useRouter();

  const { table } = useDataTable({
    data,
    columns,
    pageCount: -1,
    manualPagination: false,
    manualFiltering: false,
    shallow: false,
    debounceMs: 500,
    globalFilterFn: searchFields
      ? (row, _columnId, filterValue: string) => {
          if (!filterValue) return true;
          const regex = new RegExp(filterValue, 'i');
          return searchFields.some((field) => {
            const val = row.getValue(field as string);
            return typeof val === 'string' && regex.test(val);
          });
        }
      : undefined
  });

  return (
    <DataTable
      table={table}
      onRowClick={(row) =>
        router.push(`${basePath}/${row.original.id}/details`)
      }
    >
      <DataTableToolbar table={table}>
        {searchFields && (
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getState().globalFilter as string) ?? ''}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              className='h-8 w-40 pl-9 lg:w-64'
            />
          </div>
        )}
      </DataTableToolbar>
    </DataTable>
  );
}

interface EntityFilteredTableProps<T extends Record<string, unknown>> {
  columns: ColumnDef<T>[];
  basePath: string;
  useQuery: (params: Record<string, string>) => {
    data?: { items?: T[] };
    isLoading: boolean;
  };
  status: string;
  typeLabel?: string;
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
}

export function EntityFilteredTable<T extends Record<string, unknown>>({
  columns,
  basePath,
  useQuery,
  status,
  typeLabel = 'items',
  searchFields,
  searchPlaceholder = 'Search...'
}: EntityFilteredTableProps<T>) {
  const router = useRouter();
  const { data, isLoading } = useQuery({ status });
  const items = data?.items ?? [];

  const { table } = useDataTable({
    data: items,
    columns,
    pageCount: -1,
    manualPagination: false,
    manualFiltering: false,
    shallow: false,
    debounceMs: 500,
    globalFilterFn: searchFields
      ? (row, _columnId, filterValue: string) => {
          if (!filterValue) return true;
          const regex = new RegExp(filterValue, 'i');
          return searchFields.some((field) => {
            const val = row.getValue(field as string);
            return typeof val === 'string' && regex.test(val);
          });
        }
      : undefined
  });

  return (
    <>
      {isLoading ? (
        <div className='text-muted-foreground text-sm'>
          Loading {typeLabel}...
        </div>
      ) : (
        <DataTable
          table={table}
          onRowClick={(row) =>
            router.push(`${basePath}/${row.original.id}/details`)
          }
        >
          <DataTableToolbar table={table}>
            {searchFields && (
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
                <Input
                  placeholder={searchPlaceholder}
                  value={(table.getState().globalFilter as string) ?? ''}
                  onChange={(e) => table.setGlobalFilter(e.target.value)}
                  className='h-8 w-40 pl-9 lg:w-64'
                />
              </div>
            )}
          </DataTableToolbar>
        </DataTable>
      )}
    </>
  );
}
