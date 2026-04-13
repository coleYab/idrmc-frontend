'use client';

import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  IconAlertTriangle,
  IconClock,
  IconArrowLeft,
  IconTrash,
  IconEye
} from '@tabler/icons-react';
import { useNotificationStore } from '@/features/notifications/utils/store';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface AlertDetailsPageProps {
  params: { alertId: string };
}

export default function AlertDetailsPage(props: AlertDetailsPageProps) {
  const { alertId } = props.params;
  const { notifications, markAsRead, removeNotification, updateStatus } =
    useNotificationStore();

  // Find the alert by ID
  const alert = notifications.find(
    (notification) => notification.id === alertId
  );

  if (!alert) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'read':
        return <Badge variant='secondary'>Read</Badge>;
      case 'acknowledged':
        return (
          <Badge className='bg-blue-500 hover:bg-blue-600'>Acknowledged</Badge>
        );
      case 'resolved':
        return (
          <Badge className='bg-green-500 hover:bg-green-600'>Resolved</Badge>
        );
      default:
        return <Badge variant='default'>Unread</Badge>;
    }
  };

  const [selectedStatus, setSelectedStatus] = useState(alert.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // Backend error structure as defined by the backend
  interface BackendError {
    statusCode: number;
    message: string;
    localizedMessage: string;
    errorName: string;
    details: Record<string, any>;
    path: string;
    requestId: string;
    timestamp: string;
  }

  const handleUpdateStatus = async () => {
    setIsUpdating(true);

    try {
      // Simulating a backend call that succeeds
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If it succeeded, update local store
      updateStatus(alert.id, selectedStatus as any);
      toast.success('Status updated successfully');
    } catch (e) {
      const error = e as BackendError;
      toast.error('Error updating status', {
        description: error.localizedMessage || error.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveAlert = () => {
    removeNotification(alert.id);
  };

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Alert Details & Status Update'
      pageDescription='View and manage the status of this broadcasted disaster alert.'
      pageHeaderAction={
        <Button asChild variant='outline'>
          <Link href='/disastermanager/alerts'>
            <IconArrowLeft className='mr-2 size-4' />
            Back to Alerts
          </Link>
        </Button>
      }
    >
      <div className='mx-auto max-w-4xl space-y-6'>
        {/* Alert Overview */}
        <Card>
          <CardHeader>
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-3'>
                <IconAlertTriangle className='size-8 text-red-500' />
                <div>
                  <CardTitle className='text-2xl'>
                    {alert.title.replace('🚨 ACTIVE DISASTER ALERT: ', '')}
                  </CardTitle>
                  <CardDescription className='mt-1'>
                    Broadcasted Alert Details
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(alert.status)}
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Alert Body */}
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Alert Message</h3>
              <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                <p className='leading-relaxed text-red-800'>{alert.body}</p>
              </div>
            </div>

            {/* Alert Metadata */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <IconClock className='text-muted-foreground size-5' />
                  <div>
                    <p className='text-sm font-medium'>Broadcast Time</p>
                    <p className='text-muted-foreground text-sm'>
                      {formatDate(alert.createdAt)}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='bg-muted flex size-5 items-center justify-center rounded-full'>
                    <span className='text-xs font-medium'>ID</span>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Alert ID</p>
                    <p className='text-muted-foreground font-mono text-sm'>
                      {alert.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='bg-muted flex size-5 items-center justify-center rounded-full'>
                    <span className='text-xs font-medium'>📢</span>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Alert Type</p>
                    <p className='text-muted-foreground text-sm'>
                      Disaster Broadcast Alert
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='bg-muted flex size-5 items-center justify-center rounded-full'>
                    <span className='text-xs font-medium'>👥</span>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Recipients</p>
                    <p className='text-muted-foreground text-sm'>
                      All Response Teams & Personnel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Update Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Status Management</CardTitle>
            <CardDescription>
              Update the status of this alert or remove it from the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap items-center gap-3'>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='unread'>Unread</SelectItem>
                  <SelectItem value='read'>Read</SelectItem>
                  <SelectItem value='acknowledged'>Acknowledged</SelectItem>
                  <SelectItem value='resolved'>Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className='flex items-center gap-2'
              >
                {isUpdating ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <IconEye className='size-4' />
                )}
                Update Status
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='destructive'
                    className='flex items-center gap-2'
                  >
                    <IconTrash className='size-4' />
                    Remove Alert
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Alert</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this alert from the system.
                      This action cannot be undone. Are you sure you want to
                      remove "
                      {alert.title.replace('🚨 ACTIVE DISASTER ALERT: ', '')}"?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemoveAlert}
                      className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    >
                      Remove Alert
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Alert Actions (if any) */}
        {alert.actions && alert.actions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Alert Actions</CardTitle>
              <CardDescription>
                Available actions related to this alert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {alert.actions.map((action, index) => (
                  <Button key={index} variant='outline' size='sm'>
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
