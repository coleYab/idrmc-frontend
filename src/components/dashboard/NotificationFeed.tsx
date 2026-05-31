'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IconAlertTriangle, IconClock, IconMapPin } from '@tabler/icons-react';
import { useDisasters } from '@/features/disasters/api/disasters';
import { formatDistanceToNow } from 'date-fns';

interface NotificationFeedProps {
  className?: string;
}

export function NotificationFeed({ className }: NotificationFeedProps) {
  const { data: disasters } = useDisasters();
  const allDisasters = disasters?.items ?? [];

  // Get recent incidents (pending and active) sorted by creation date
  const recentIncidents = allDisasters
    .filter((incident) => incident.status === 'Active')
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? '').getTime() -
        new Date(a.createdAt ?? '').getTime()
    )
    .slice(0, 10); // Show latest 10

  const getSeverityColor = (severity: string) => {
    const s = severity.toLowerCase();
    if (s === 'critical') return 'destructive';
    if (s === 'high') return 'destructive';
    if (s === 'medium') return 'secondary';
    if (s === 'low') return 'outline';
    return 'outline';
  };

  const getStatusIcon = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === 'pending') return <IconClock className='size-4' />;
    return <IconAlertTriangle className='size-4' />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconAlertTriangle className='size-5' />
          Real-time Notification Feed
        </CardTitle>
        <CardDescription>
          Latest incoming reports and active incidents requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px]'>
          <div className='space-y-4'>
            {recentIncidents.length === 0 ? (
              <div className='text-muted-foreground py-8 text-center'>
                No active notifications at this time
              </div>
            ) : (
              recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className='bg-card hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 transition-colors'
                >
                  <Avatar className='size-8'>
                    <AvatarFallback className='text-xs'>
                      {(incident as any).reportedBy === 'anonymous' ||
                      !(incident as any).reportedBy
                        ? 'A'
                        : (incident as any).reportedBy.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h4 className='line-clamp-1 text-sm font-medium'>
                        {incident.title}
                      </h4>
                      <Badge
                        variant={getSeverityColor(incident.severity)}
                        className='text-xs'
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className='text-muted-foreground line-clamp-2 text-xs'>
                      {incident.description}
                    </p>
                    <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                      <div className='flex items-center gap-1'>
                        <IconMapPin className='size-3' />
                        {incident.location}
                      </div>
                      <div className='flex items-center gap-1'>
                        {getStatusIcon(incident.status)}
                        {incident.status ?? 'Unknown'}
                      </div>
                      <div>
                        {formatDistanceToNow(
                          new Date(incident.createdAt ?? ''),
                          {
                            addSuffix: true
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
