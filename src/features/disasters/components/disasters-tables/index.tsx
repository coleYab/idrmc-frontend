'use client';

import {
  EntityTable,
  EntityFilteredTable
} from '@/components/table/data-table-entity';
import { columns } from './columns';
import { useDisasters } from '@/features/disasters/api/disasters';
import type { Disaster } from '../../types';

export function DisastersTable(props: {
  data: Disaster[];
  totalItems: number;
}) {
  return (
    <EntityTable
      {...props}
      columns={columns}
      basePath='/disastermanager/disasters'
    />
  );
}

export function DisastersFilteredTable({
  status
}: {
  status: 'Active' | 'Resolved';
}) {
  return (
    <EntityFilteredTable
      columns={columns}
      basePath='/disastermanager/disasters'
      useQuery={useDisasters}
      status={status}
      typeLabel='disasters'
    />
  );
}
