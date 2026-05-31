'use client';

import {
  EntityTable,
  EntityFilteredTable
} from '@/components/table/data-table-entity';
import { columns } from './columns';
import { useIncidents } from '@/features/incidents/api/incidents';
import type { Incident } from '../../types';

export function IncidentsTable(props: {
  data: Incident[];
  totalItems: number;
}) {
  return (
    <EntityTable
      {...props}
      columns={columns}
      basePath='/incval/incidents'
      searchFields={['title', 'location']}
      searchPlaceholder='Search by title or location...'
    />
  );
}

export function IncidentsFilteredTable({ status }: { status: string }) {
  return (
    <EntityFilteredTable
      columns={columns}
      basePath='/incval/incidents'
      useQuery={useIncidents}
      status={status}
      typeLabel='incidents'
      searchFields={['title', 'location']}
      searchPlaceholder='Search by title or location...'
    />
  );
}
