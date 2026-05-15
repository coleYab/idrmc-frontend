'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconAlertTriangle, IconClock, IconEye } from '@tabler/icons-react';
import { useNotificationStore } from '@/features/notifications/utils/store';

export default function AlertsClient() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const disasterAlerts = notifications.filter(
    (notification) =>
      notification.id.startsWith('disaster-alert-') ||
      notification.id.startsWith('alert-')
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <div className='space-y-6'>
      {disasterAlerts.length > 0 ? (
        <>
          <div className='flex justify-end'>
            <Button onClick={markAllAsRead} variant='outline'>
              Mark All as Read
            </Button>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {disasterAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`transition-shadow hover:shadow-lg ${
                  alert.status === 'unread' ? 'border-l-4 border-l-red-500' : ''
                }`}
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                      <IconAlertTriangle className='size-5 text-red-500' />
                      <CardTitle className='text-lg leading-tight'>
                        {alert.title.replace('🚨 ACTIVE DISASTER ALERT: ', '')}
                      </CardTitle>
                    </div>
                    {getStatusBadge(alert.status)}
                  </div>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <IconClock className='size-4' />
                    <span>{formatDate(alert.createdAt)}</span>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <CardDescription className='text-sm leading-relaxed'>
                    {alert.body}
                  </CardDescription>

                  <div className='flex gap-2'>
                    <Button asChild size='sm' className='flex-1'>
                      <Link href={`/disastermanager/alerts/${alert.id}`}>
                        Update Status
                      </Link>
                    </Button>
                    {alert.status === 'unread' && (
                      <Button
                        onClick={() => markAsRead(alert.id)}
                        variant='outline'
                        size='sm'
                      >
                        <IconEye className='size-4' />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <IconAlertTriangle className='text-muted-foreground mb-4 size-12' />
            <h3 className='mb-2 text-lg font-semibold'>
              No Broadcasted Alerts
            </h3>
            <p className='text-muted-foreground max-w-md text-center'>
              There are currently no disaster alerts that have been broadcasted.
              Alerts will appear here when active disasters are escalated and
              alerts are sent to response teams.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
