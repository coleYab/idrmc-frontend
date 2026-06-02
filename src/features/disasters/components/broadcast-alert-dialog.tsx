'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBroadcastNotification } from '@/features/notifications/api/notifications';
import { toast } from 'sonner';
import { Loader2, Bell } from 'lucide-react';

export function BroadcastAlertDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const broadcast = useBroadcastNotification();

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    try {
      const result = await broadcast.mutateAsync({
        title: title.trim(),
        message: message.trim()
      });

      toast.success('Alert broadcast successfully', {
        description: result.totalUsers
          ? `Sent to ${result.totalUsers} users`
          : undefined
      });

      setOpen(false);
      setTitle('');
      setMessage('');
    } catch {
      toast.error('Failed to broadcast alert');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive'>
          <Bell className='mr-2 size-4' />
          Broadcast Alert
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Broadcast Alert</DialogTitle>
          <DialogDescription>
            Send an emergency alert notification to all active users.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='alert-title'>Alert Title</Label>
            <Input
              id='alert-title'
              placeholder='e.g. Emergency Flood Warning'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='alert-message'>Message</Label>
            <Textarea
              id='alert-message'
              placeholder='Describe the alert details...'
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              setOpen(false);
              setTitle('');
              setMessage('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleSubmit}
            disabled={broadcast.isPending}
          >
            {broadcast.isPending && (
              <Loader2 className='mr-2 size-4 animate-spin' />
            )}
            Send Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
