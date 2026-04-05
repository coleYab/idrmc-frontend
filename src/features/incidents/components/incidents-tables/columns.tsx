'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { CellAction } from './cell-action';
import { STATUS_OPTIONS, SEVERITY_OPTIONS } from './options';
import { Text } from 'lucide-react';
import { Incident } from '@/constants/mock-api';

export const columns: ColumnDef<Incident>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Incident ID' />
    ),
    cell: ({ cell }) => <div className="font-medium">{cell.getValue<string>()}</div>,
    meta: {
      label: 'Incident ID',
      placeholder: 'Search ID...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ cell }) => (
      <div className="max-w-[400px] truncate">{cell.getValue<string>()}</div>
    ),
    meta: {
      label: 'Description',
      placeholder: 'Search Description...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: 'Location',
      placeholder: 'Search location...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<string>();
      let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'secondary';
      if (status.toLowerCase() === 'pending') variant = 'outline';
      if (status.toLowerCase() === 'validated') variant = 'default';
      if (status.toLowerCase() === 'escalated') variant = 'destructive';

      return (
        <Badge variant={variant} className='capitalize'>
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status',
      variant: 'multiSelect',
      options: STATUS_OPTIONS
    }
  },
  {
    id: 'severityLevel',
    accessorKey: 'severityLevel',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Severity' />
    ),
    cell: ({ cell }) => (
      <Badge variant='outline' className='capitalize'>
        {cell.getValue<string>()}
      </Badge>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Severity Level',
      variant: 'multiSelect',
      options: SEVERITY_OPTIONS
    }
  },
  {
    id: 'reportDate',
    accessorKey: 'reportDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reported On' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
