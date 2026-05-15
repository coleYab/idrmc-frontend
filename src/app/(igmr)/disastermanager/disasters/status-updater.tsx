'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { updateDisasterStatus } from './actions';
import { IncidentStatus } from '@/lib/types/incident';

interface StatusUpdaterProps {
  disasterId: string;
  currentStatus: string;
}

export function StatusUpdater({
  disasterId,
  currentStatus
}: StatusUpdaterProps) {
  const [status, setStatus] = useState<string>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateDisasterStatus(disasterId, status);
      toast.success('Disaster status updated successfully');
    } catch (error) {
      toast.error('Failed to update disaster status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='flex items-center gap-3'>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={IncidentStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={IncidentStatus.VERIFIED}>Verified</SelectItem>
          <SelectItem value={IncidentStatus.ACTIVE}>Active</SelectItem>
          <SelectItem value={IncidentStatus.RESOLVED}>Resolved</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdate}
        disabled={isUpdating || status === currentStatus}
      >
        {isUpdating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        Update Status
      </Button>
    </div>
  );
}
