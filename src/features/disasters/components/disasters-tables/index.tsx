'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { columns } from './columns';
import { useDisasters } from '@/features/disasters/api/disasters';
import type { Disaster } from '../../types';

interface DisastersTableProps {
  data: Disaster[];
  totalItems: number;
}

export function DisastersTable({ data, totalItems }: DisastersTableProps) {
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
        router.push(`/disastermanager/disasters/${row.original.id}/details`)
      }
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

interface DisastersFilteredTableProps {
  status: 'Active' | 'Resolved';
}

export function DisastersFilteredTable({
  status
}: DisastersFilteredTableProps) {
  const router = useRouter();
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const { data, isLoading } = useDisasters({ status });
  const disasters = data?.items ?? [];

  const pageCount = Math.ceil(disasters.length / pageSize);

  const { table } = useDataTable({
    data: disasters,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <>
      {isLoading ? (
        <div className='text-muted-foreground text-sm'>
          Loading disasters...
        </div>
      ) : (
        <DataTable
          table={table}
          onRowClick={(row) =>
            router.push(`/disastermanager/disasters/${row.original.id}/details`)
          }
        >
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </>
  );
}
