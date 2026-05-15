'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import {
  IncidentStatusEnum,
  IncidentTypeEnum,
  SeverityLevelEnum,
  type Incident
} from '@/features/incidents/types';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column } from '@tanstack/react-table';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  User,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

export const columns: ColumnDef<Incident>[] = [
  {
    id: 'incidentTitle',
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
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const status =
        cell.getValue<
          (typeof IncidentStatusEnum)['enum'][keyof (typeof IncidentStatusEnum)['enum']]
        >();
      const colorMap = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Verified: 'bg-blue-100 text-blue-800',
        Active: 'bg-red-100 text-red-800',
        Resolved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800'
      };
      return <Badge className={colorMap[status]}>{status}</Badge>;
    },
    meta: {
      label: 'Status',
      placeholder: 'Filter by status...',
      variant: 'select',
      options: IncidentStatusEnum.options.map((status) => ({
        label: status,
        value: status
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
    id: 'reportedBy',
    accessorKey: 'reportedBy',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Reporter' />
    ),
    cell: ({ cell }) => (
      <div className='flex items-center gap-2'>
        <User className='text-muted-foreground h-4 w-4' />
        <span>{cell.getValue<string>()}</span>
      </div>
    ),
    meta: {
      label: 'Reporter',
      placeholder: 'Search by reporter...',
      variant: 'text',
      icon: User
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
    id: 'dateRange',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<Incident, unknown> }) => (
      <DataTableColumnHeader column={column} title='Reported Date' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return (
        <div className='flex items-center gap-2'>
          <Calendar className='text-muted-foreground h-4 w-4' />
          <span>{format(date, 'MMM dd, yyyy')}</span>
        </div>
      );
    },
    meta: {
      label: 'Date Range',
      variant: 'dateRange'
    },
    enableColumnFilter: true
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
    },
    meta: {
      label: 'Requires Medical',
      variant: 'boolean'
    },
    enableColumnFilter: true
  }
];

interface IncidentsSearchTableProps {
  data: Incident[];
  totalItems: number;
}

export function IncidentsSearchTable({
  data,
  totalItems
}: IncidentsSearchTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
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
