'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Incident } from '@/constants/mock-api';
import Link from 'next/link';
import type { Incident } from '../../types';
import {
  IconDotsVertical,
  IconCheck,
  IconEye,
  IconAlertTriangle,
  IconDatabase
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface CellActionProps {
  data: Incident;
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <IconDotsVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push(`/incval/incidents/${data.id}/details`)}
        >
          <IconEye className='mr-2 h-4 w-4' /> View Details
        <DropdownMenuItem asChild>
          <Link href={`/incval/incidents/${data.id}/details`}>
            <IconEye className='mr-2 h-4 w-4' /> View Details
          </Link>
        </DropdownMenuItem>

        {data.status.toLowerCase() === 'pending' && (
          <DropdownMenuItem asChild>
            <Link href={`/incval/incidents/${data.id}/verify`}>
              <IconCheck className='mr-2 h-4 w-4' /> Validate Incident
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className='text-amber-500 focus:text-amber-500'>
          <IconAlertTriangle className='mr-2 h-4 w-4' /> Escalate
        </DropdownMenuItem>

        {/* <DropdownMenuItem className='text-muted-foreground focus:text-muted-foreground'>
        <DropdownMenuItem className='text-muted-foreground focus:text-muted-foreground'>
          <IconDatabase className='mr-2 h-4 w-4' /> Assign Resources
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
