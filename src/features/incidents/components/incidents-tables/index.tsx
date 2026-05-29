'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { columns } from './columns';
import type { Incident } from '../../types';

interface IncidentsTableProps {
  data: Incident[];
  totalItems: number;
}

export function IncidentsTable({ data, totalItems }: IncidentsTableProps) {
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
        router.push(`/incval/incidents/${row.original.id}/details`)
      }
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
