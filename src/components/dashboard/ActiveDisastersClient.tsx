'use client';

import { useNotificationStore } from '@/features/notifications/utils/store';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus, IncidentSeverityLevel } from '@/lib/types/incident';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  IconMapPin,
  IconUsers,
  IconClock,
  IconUser
} from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const getSeverityColor = (severity: IncidentSeverityLevel) => {
  switch (severity) {
    case IncidentSeverityLevel.CRITICAL:
      return 'destructive';
    case IncidentSeverityLevel.HIGH:
      return 'destructive';
    case IncidentSeverityLevel.MEDIUM:
      return 'secondary';
    case IncidentSeverityLevel.LOW:
      return 'outline';
    default:
      return 'outline';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function ActiveDisastersClient() {
  const router = useRouter();
  const { addNotification } = useNotificationStore();

  const activeDisasters = mockIncidents.filter(
    (incident) => incident.status === IncidentStatus.ACTIVE
  );

  const [isBroadcasting, setIsBroadcasting] = useState<string | null>(null);

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

  const broadcastAlertForDisaster = async (
    disaster: (typeof mockIncidents)[0]
  ) => {
    setIsBroadcasting(disaster.id);

    try {
      // Simulating a backend call that succeeds
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const alertNotification = {
        id: `disaster-alert-${disaster.id}-${Date.now()}`,
        title: `🚨 ACTIVE DISASTER ALERT: ${disaster.title}`,
        body: `CRITICAL: Active ${disaster.incidentType} disaster in ${disaster.location}. Severity: ${disaster.severity}. Affected population: ${disaster.affectedPopulationCount.toLocaleString()}. Immediate response required.`,
        status: 'unread' as const,
        createdAt: new Date().toISOString(),
        actions: [
          {
            id: 'view-disaster',
            label: 'View Disaster Details',
            type: 'redirect' as const,
            style: 'primary' as const
          }
        ]
      };

      addNotification(alertNotification);
      toast.success(
        `Disaster alert for "${disaster.title}" has been successfully broadcasted!`
      );
    } catch (e) {
      const error = e as BackendError;
      toast.error('Error broadcasting alert', {
        description: error.localizedMessage || error.message
      });
    } finally {
      setIsBroadcasting(null);
    }
  };

  return (
    <div className='space-y-6'>
      {activeDisasters.length > 0 ? (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {activeDisasters.map((disaster) => (
            <Card
              key={disaster.id}
              className='hover:bg-muted/30 pointer-events-auto cursor-pointer transition-shadow hover:shadow-lg'
              onClick={() =>
                router.push(`/disastermanager/disasters/${disaster.id}/details`)
              }
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>{disaster.title}</CardTitle>
                    <CardDescription>{disaster.description}</CardDescription>
                  </div>
                  <Badge
                    variant={getSeverityColor(disaster.severity)}
                    className='ml-2'
                  >
                    {disaster.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='flex items-center gap-2'>
                    <IconMapPin className='text-muted-foreground size-4' />
                    <span className='truncate'>{disaster.location}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconUsers className='text-muted-foreground size-4' />
                    <span>
                      {disaster.affectedPopulationCount.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconUser className='text-muted-foreground size-4' />
                    <span className='truncate'>{disaster.reportedBy}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconClock className='text-muted-foreground size-4' />
                    <span>{formatDate(disaster.createdAt)}</span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Incident Type:
                    </span>
                    <Badge variant='outline'>{disaster.incidentType}</Badge>
                  </div>
                  {disaster.requiresUrgentMedical && (
                    <div className='flex items-center gap-2 text-sm text-red-600'>
                      <IconAlertTriangle className='size-4' />
                      <span>Urgent Medical Attention Required</span>
                    </div>
                  )}
                  {disaster.infrastructureDamage.length > 0 && (
                    <div className='text-sm'>
                      <span className='text-muted-foreground'>
                        Infrastructure Damage:
                      </span>
                      <ul className='mt-1 list-inside list-disc text-xs'>
                        {disaster.infrastructureDamage
                          .slice(0, 2)
                          .map((damage, idx) => (
                            <li key={idx}>{damage}</li>
                          ))}
                        {disaster.infrastructureDamage.length > 2 && (
                          <li>
                            +{disaster.infrastructureDamage.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div
                  className='flex gap-2 pt-2'
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button asChild size='sm' className='flex-1'>
                    <Link
                      href={`/disastermanager/disasters/${disaster.id}/details`}
                    >
                      View Details
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='destructive'
                        size='sm'
                        className='flex-1'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconAlertTriangle className='mr-1 size-3' />
                        Broadcast Alert
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Broadcast Disaster Alert
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will broadcast an urgent alert for "
                          {disaster.title}" to all relevant personnel and
                          systems. This action cannot be undone. Are you sure
                          you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => broadcastAlertForDisaster(disaster)}
                          className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                          Broadcast Alert
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <IconAlertTriangle className='text-muted-foreground mb-4 size-12' />
            <h3 className='mb-2 text-lg font-semibold'>No Active Disasters</h3>
            <p className='text-muted-foreground max-w-md text-center'>
              There are currently no verified incidents with active status
              requiring disaster response coordination. All incidents are either
              pending verification, resolved, or not yet escalated to active
              disaster status.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
