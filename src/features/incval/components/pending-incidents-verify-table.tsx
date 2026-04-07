'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { mockIncidents } from '@/lib/mock/incidents';
import {
  Incident,
  IncidentSeverityLevel,
  IncidentType,
  IncidentStatus
} from '@/lib/types/incident';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column } from '@tanstack/react-table';
import { AlertTriangle, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export const columns: ColumnDef<Incident>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ cell }) => (
      <Link
        href={`/incval/incidents/${cell.row.original.id}/verify`}
        className='font-medium hover:underline'
      >
        {cell.getValue<string>()}
      </Link>
    ),
    meta: {
      label: 'Title',
      placeholder: 'Search incidents...',
      variant: 'text',
      icon: AlertTriangle
    },
    enableColumnFilter: true
  },
  {
    id: 'incidentType',
    accessorKey: 'incidentType',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ cell }) => {
      const type = cell.getValue<IncidentType>();
      return <Badge variant='outline'>{type}</Badge>;
    },
    meta: {
      label: 'Type',
      placeholder: 'Filter by type...',
      variant: 'select',
      options: Object.values(IncidentType).map((type) => ({
        label: type,
        value: type
      }))
    },
    enableColumnFilter: true
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ cell }) => (
      <div className='flex items-center gap-2'>
        <MapPin className='text-muted-foreground h-4 w-4' />
        <span>{cell.getValue<string>()}</span>
      </div>
    ),
    meta: {
      label: 'Location',
      placeholder: 'Search locations...',
      variant: 'text',
      icon: MapPin
    },
    enableColumnFilter: true
  },
  {
    id: 'reportedBy',
    accessorKey: 'reportedBy',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Reported By' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: 'Reported By',
      placeholder: 'Search reporters...',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Reported At' />
    ),
    cell: ({ cell }) => (
      <div className='flex items-center gap-2'>
        <Clock className='text-muted-foreground h-4 w-4' />
        <span>{format(new Date(cell.getValue<string>()), 'PPp')}</span>
      </div>
    ),
    enableSorting: true
  }
];

export function PendingIncidentsVerifyTable() {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pendingIncidents = mockIncidents.filter(
    (incident) => incident.status === IncidentStatus.PENDING
  );

  const { table } = useDataTable({
    data: pendingIncidents,
    columns,
    pageCount: Math.ceil(pendingIncidents.length / pageSize),
    shallow: false,
    debounceMs: 500
  });

  if (pendingIncidents.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <AlertTriangle className='text-muted-foreground mb-4 h-12 w-12' />
        <h3 className='mb-2 text-lg font-medium'>No Incidents to Verify</h3>
        <p className='text-muted-foreground'>
          All incident reports have been verified or are currently being
          processed.
        </p>
      </div>
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
