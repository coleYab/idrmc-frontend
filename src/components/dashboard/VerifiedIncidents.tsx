'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
  IconPlus,
  IconMapPin,
  IconUsers
} from '@tabler/icons-react';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus, IncidentSeverityLevel } from '@/lib/types/incident';
import { useNotificationStore } from '@/features/notifications/utils/store';

interface VerifiedIncidentsProps {
  className?: string;
}

export function VerifiedIncidents({ className }: VerifiedIncidentsProps) {
  const { addNotification } = useNotificationStore();

  // Filter verified incidents
  const verifiedIncidents = mockIncidents.filter(
    (incident) => incident.status === IncidentStatus.VERIFIED
  );

  const createAlertForIncident = (incident: (typeof mockIncidents)[0]) => {
    const alertNotification = {
      id: `alert-${incident.id}-${Date.now()}`,
      title: `Alert: ${incident.title}`,
      body: `Verified incident alert for ${incident.incidentType} in ${incident.location}. Severity: ${incident.severity}. Affected population: ${incident.affectedPopulationCount.toLocaleString()}.`,
      status: 'unread' as const,
      createdAt: new Date().toISOString(),
      actions: [
        {
          id: 'view-incident',
          label: 'View Incident',
          type: 'redirect' as const,
          style: 'primary' as const
        }
      ]
    };

    addNotification(alertNotification);
  };

  const createAlertForUnreported = () => {
    const alertNotification = {
      id: `alert-unreported-${Date.now()}`,
      title: 'Alert: Unreported Incidents Check',
      body: 'Please check for any unreported incidents that may require immediate attention. Review recent reports and field assessments.',
      status: 'unread' as const,
      createdAt: new Date().toISOString(),
      actions: [
        {
          id: 'check-reports',
          label: 'Check Reports',
          type: 'redirect' as const,
          style: 'primary' as const
        }
      ]
    };

    addNotification(alertNotification);
  };

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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconAlertTriangle className='size-5' />
          Verified Incidents
        </CardTitle>
        <CardDescription>
          Recently verified incidents requiring attention and alert creation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Verified Incidents List */}
          {verifiedIncidents.length > 0 ? (
            <div className='space-y-3'>
              {verifiedIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h4 className='text-sm font-medium'>{incident.title}</h4>
                      <Badge
                        variant={getSeverityColor(incident.severity)}
                        className='text-xs'
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                    <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                      <div className='flex items-center gap-1'>
                        <IconMapPin className='size-3' />
                        {incident.location}
                      </div>
                      <div className='flex items-center gap-1'>
                        <IconUsers className='size-3' />
                        {incident.affectedPopulationCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='outline' size='sm' className='ml-2'>
                        <IconAlertTriangle className='mr-1 size-4' />
                        Create Alert
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Create Alert for Incident
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will create an alert notification for "
                          {incident.title}" that will be visible to all relevant
                          personnel. Are you sure you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => createAlertForIncident(incident)}
                        >
                          Create Alert
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-muted-foreground py-4 text-center text-sm'>
              No verified incidents at this time
            </div>
          )}

          {/* Create Alert for Unreported Incidents */}
          <div className='border-t pt-4'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='secondary' className='w-full'>
                  <IconPlus className='mr-2 size-4' />
                  Create Alert for Unreported Incidents
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Create Alert for Unreported Incidents
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will create a general alert to check for any unreported
                    incidents that may require immediate attention. This is
                    useful for proactive monitoring and ensuring no incidents
                    are missed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={createAlertForUnreported}>
                    Create Alert
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
