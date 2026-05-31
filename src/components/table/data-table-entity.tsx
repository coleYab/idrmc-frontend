'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { ColumnDef } from '@tanstack/react-table';

interface EntityTableProps<T extends { id: string }> {
  data: T[];
  totalItems: number;
  columns: ColumnDef<T>[];
  basePath: string;
}

export function EntityTable<T extends { id: string }>({
  data,
  totalItems,
  columns,
  basePath
}: EntityTableProps<T>) {
  const router = useRouter();
  const pageCount = Math.ceil(totalItems / 10);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable
      table={table}
      onRowClick={(row) =>
        router.push(`${basePath}/${row.original.id}/details`)
      }
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

interface EntityFilteredTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[];
  basePath: string;
  useQuery: (params: Record<string, string>) => {
    data?: { items?: T[] };
    isLoading: boolean;
  };
  status: string;
  typeLabel?: string;
}

export function EntityFilteredTable<T extends { id: string }>({
  columns,
  basePath,
  useQuery,
  status,
  typeLabel = 'items'
}: EntityFilteredTableProps<T>) {
  const router = useRouter();
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const { data, isLoading } = useQuery({ status });
  const items = data?.items ?? [];

  const pageCount = Math.ceil(items.length / pageSize);

  const { table } = useDataTable({
    data: items,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500
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
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </>
  );
}
