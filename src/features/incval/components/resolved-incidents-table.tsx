'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useIncidents } from '@/features/incidents/api/incidents';
import {
  IncidentTypeEnum,
  SeverityLevelEnum,
  type Incident
} from '@/features/incidents/types';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column } from '@tanstack/react-table';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  User
} from 'lucide-react';
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
      const type =
        cell.getValue<
          (typeof IncidentTypeEnum)['enum'][keyof (typeof IncidentTypeEnum)['enum']]
        >();
      return <Badge variant='outline'>{type}</Badge>;
    },
    meta: {
      label: 'Type',
      placeholder: 'Filter by type...',
      variant: 'select',
      options: IncidentTypeEnum.options.map((type) => ({
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
      const severity =
        cell.getValue<
          (typeof SeverityLevelEnum)['enum'][keyof (typeof SeverityLevelEnum)['enum']]
        >();
      const colorMap = {
        Low: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        High: 'bg-orange-100 text-orange-800',
        Critical: 'bg-red-100 text-red-800'
      };
      return <Badge className={colorMap[severity]}>{severity}</Badge>;
    },
    meta: {
      label: 'Severity',
      placeholder: 'Filter by severity...',
      variant: 'select',
      options: SeverityLevelEnum.options.map((severity) => ({
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
          <CheckCircle className='h-4 w-4 text-green-500' />
          <Badge variant='default' className='bg-green-100 text-green-800'>
            {status}
          </Badge>
        </div>
      );
    }
  },
  {
    id: 'resolvedBy',
    accessorKey: 'resolvedBy',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Resolved By' />
    ),
    cell: ({ cell }) => {
      const resolvedBy = cell.getValue<string | null>();
      return resolvedBy ? (
        <div className='flex items-center gap-2'>
          <User className='text-muted-foreground h-4 w-4' />
          <span>{resolvedBy}</span>
        </div>
      ) : (
        <span className='text-muted-foreground'>Unknown</span>
      );
    }
  },
  {
    id: 'resolvedAt',
    accessorKey: 'resolvedAt',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Resolved Date' />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<string | null>();
      return date ? (
        <div className='flex items-center gap-2'>
          <Clock className='text-muted-foreground h-4 w-4' />
          <span>{format(new Date(date), 'MMM dd, yyyy')}</span>
        </div>
      ) : (
        <span className='text-muted-foreground'>Not resolved</span>
      );
    }
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Reported' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return (
        <div className='flex items-center gap-2'>
          <Clock className='text-muted-foreground h-4 w-4' />
          <span>{format(date, 'MMM dd, yyyy')}</span>
        </div>
      );
    }
  }
];

interface ResolvedIncidentsTableProps {}

export function ResolvedIncidentsTable({}: ResolvedIncidentsTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const { data, isLoading } = useIncidents({ limit: 100, offset: 0 });

  const resolvedIncidents = (data?.items ?? []).filter(
    (incident) => incident.status === 'Resolved'
  );

  const pageCount = Math.ceil(resolvedIncidents.length / pageSize);

  const { table } = useDataTable({
    data: resolvedIncidents,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <>
      {isLoading ? (
        <div className='text-muted-foreground text-sm'>
          Loading incidents...
        </div>
      ) : (
        <DataTable table={table}>
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </>
  );
}
