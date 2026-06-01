'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { STATUS_OPTIONS, SEVERITY_OPTIONS } from './options';
import { CellAction } from './cell-action';
import { Text } from 'lucide-react';
import type { Incident } from '../../types';

export const columns: ColumnDef<Incident>[] = [
  {
    // this another commit with id and stuff
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Incident ID' />
    ),
    cell: ({ cell }) => (
      <div className='max-w-[120px] truncate font-medium'>
        {cell.getValue<string>()}
      </div>
    ),
    meta: {
      label: 'Incident ID',
      placeholder: 'Search ID...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ cell }) => (
      <div className='max-w-[250px] truncate font-medium'>
        {cell.getValue<string>()}
      </div>
    ),
    meta: {
      label: 'Title',
      placeholder: 'Search title...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'incidentType',
    accessorKey: 'incidentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.original.incidentType;
      return (
        <Badge variant='outline' className='capitalize'>
          {type}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Type',
      variant: 'multiSelect',
      options: [
        { value: 'Flood', label: 'Flood' },
        { value: 'Drought', label: 'Drought' },
        { value: 'Landslide', label: 'Landslide' },
        { value: 'Locust', label: 'Locust' },
        { value: 'Conflict', label: 'Conflict' },
        { value: 'Fire', label: 'Fire' }
      ]
    }
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
      let variant: 'default' | 'destructive' | 'outline' | 'secondary' =
        'secondary';
      if (status.toLowerCase() === 'pending') variant = 'outline';
      if (status.toLowerCase() === 'verified') variant = 'default';
      if (status.toLowerCase() === 'active') variant = 'destructive';
      if (status.toLowerCase() === 'rejected') variant = 'destructive';

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
    id: 'severity',
    accessorKey: 'severity',
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
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reported On' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return <div>{date.toLocaleDateString()}</div>;
    }
  }
];
