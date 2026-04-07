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
import { IconDotsVertical, IconCheck, IconEye, IconAlertTriangle, IconDatabase } from '@tabler/icons-react';

interface CellActionProps {
  data: Incident;
}

export function CellAction({ data }: CellActionProps) {
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
        <DropdownMenuItem>
          <IconEye className='mr-2 h-4 w-4' /> View Details
        </DropdownMenuItem>
        
        {data.status.toLowerCase() === 'pending' && (
          <DropdownMenuItem>
            <IconCheck className='mr-2 h-4 w-4' /> Validate Incident
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem className='text-amber-500 focus:text-amber-500'>
          <IconAlertTriangle className='mr-2 h-4 w-4' /> Escalate
        </DropdownMenuItem>
        
        <DropdownMenuItem className='text-muted-foreground focus:text-muted-foreground'>
          <IconDatabase className='mr-2 h-4 w-4' /> Assign Resources
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
