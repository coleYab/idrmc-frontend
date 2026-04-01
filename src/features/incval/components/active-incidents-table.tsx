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
  IncidentType
} from '@/lib/types/incident';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column } from '@tanstack/react-table';
import { Activity, AlertTriangle, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

export const columns: ColumnDef<Incident>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ cell }) => (
      <div className='font-medium'>{cell.getValue<string>()}</div>
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
    id: 'severity',
    accessorKey: 'severity',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Severity' />
    ),
    cell: ({ cell }) => {
      const severity = cell.getValue<IncidentSeverityLevel>();
      const colorMap = {
        [IncidentSeverityLevel.LOW]: 'bg-green-100 text-green-800',
        [IncidentSeverityLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
        [IncidentSeverityLevel.HIGH]: 'bg-orange-100 text-orange-800',
        [IncidentSeverityLevel.CRITICAL]: 'bg-red-100 text-red-800'
      };
      return <Badge className={colorMap[severity]}>{severity}</Badge>;
    },
    meta: {
      label: 'Severity',
      placeholder: 'Filter by severity...',
      variant: 'select',
      options: Object.values(IncidentSeverityLevel).map((severity) => ({
        label: severity,
        value: severity
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
    id: 'affectedPopulationCount',
    accessorKey: 'affectedPopulationCount',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Affected' />
    ),
    cell: ({ cell }) => {
      const count = cell.getValue<number>();
      return (
        <div className='flex items-center gap-2'>
          <Users className='text-muted-foreground h-4 w-4' />
          <span>{count.toLocaleString()}</span>
        </div>
      );
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ cell }) => {
      const status = cell.getValue<string>();
      return (
        <div className='flex items-center gap-2'>
          <Activity className='h-4 w-4 text-blue-500' />
          <Badge variant='default'>{status}</Badge>
        </div>
      );
    }
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Last Updated' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return (
        <div className='flex items-center gap-2'>
          <Clock className='text-muted-foreground h-4 w-4' />
          <span>{format(date, 'MMM dd, HH:mm')}</span>
        </div>
      );
    }
  },
  {
    id: 'requiresUrgentMedical',
    accessorKey: 'requiresUrgentMedical',
    header: 'Medical',
    cell: ({ cell }) => {
      const requires = cell.getValue<boolean>();
      return requires ? (
        <Badge variant='destructive'>Urgent</Badge>
      ) : (
        <Badge variant='secondary'>No</Badge>
      );
    }
  }
];

interface ActiveIncidentsTableProps {}

export function ActiveIncidentsTable({}: ActiveIncidentsTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  // Filter for active incidents only
  const activeIncidents = mockIncidents.filter(
    (incident) => incident.status === 'Active'
  );

  const pageCount = Math.ceil(activeIncidents.length / pageSize);

  const { table } = useDataTable({
    data: activeIncidents,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
