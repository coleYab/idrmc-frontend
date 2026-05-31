'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { FormSelect, type FormOption } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { incidentService } from '@/services/incidentServices';
import { IncidentStatus, IncidentSeverityLevel } from '@/lib/types/incident';
import type { Incident } from '@/lib/types/incident';

const severityOptions: FormOption[] = Object.values(IncidentSeverityLevel).map(
  (s) => ({ value: s, label: s })
);

const statusOptions: FormOption[] = [
  { value: IncidentStatus.VERIFIED, label: 'Verified' },
  { value: IncidentStatus.ACTIVE, label: 'Active' },
  { value: IncidentStatus.RESOLVED, label: 'Resolved' },
  { value: IncidentStatus.REJECTED, label: 'Rejected' }
];

function getAvailableStatuses(currentStatus: string): FormOption[] {
  switch (currentStatus) {
    case IncidentStatus.PENDING:
      return statusOptions.filter(
        (o) =>
          o.value === IncidentStatus.VERIFIED ||
          o.value === IncidentStatus.REJECTED
      );
    case IncidentStatus.VERIFIED:
      return statusOptions.filter(
        (o) =>
          o.value === IncidentStatus.ACTIVE ||
          o.value === IncidentStatus.RESOLVED ||
          o.value === IncidentStatus.REJECTED
      );
    case IncidentStatus.ACTIVE:
      return statusOptions.filter((o) => o.value === IncidentStatus.RESOLVED);
    default:
      return [];
  }
}

interface IncidentStatusUpdateFormProps {
  incident: Incident;
  incidentId: string;
}

export default function IncidentStatusUpdateForm({
  incident,
  incidentId
}: IncidentStatusUpdateFormProps) {
  const router = useRouter();
  const availableStatuses = getAvailableStatuses(incident.status);
  const isTerminal =
    incident.status === IncidentStatus.RESOLVED ||
    incident.status === IncidentStatus.REJECTED;

  const statusUpdateSchema = z
    .object({
      status: z.string().min(1, 'Status is required'),
      severity: z.string().min(1, 'Severity is required'),
      resolvedBy: z.string().optional(),
      workNotes: z.string().min(10, 'Notes must be at least 10 characters')
    })
    .refine(
      (data) => {
        if (data.status === IncidentStatus.RESOLVED) {
          return !!data.resolvedBy && data.resolvedBy.trim().length > 0;
        }
        return true;
      },
      {
        message: 'Resolved by is required when marking an incident resolved',
        path: ['resolvedBy']
      }
    );

  type StatusUpdateFormData = z.infer<typeof statusUpdateSchema>;

  const form = useForm<StatusUpdateFormData>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      severity: incident.severity,
      status: incident.status,
      resolvedBy: incident.resolvedBy ?? '',
      workNotes: ''
    }
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = form;

  const selectedStatus = watch('status');

  const handleFormSubmit = async (data: StatusUpdateFormData) => {
    try {
      const newStatus = data.status;

      if (
        newStatus === incident.status &&
        data.severity === incident.severity
      ) {
        toast.error('No changes were made.');
        return;
      }

      if (
        newStatus === incident.status &&
        data.severity !== incident.severity
      ) {
        const found = await incidentService.getById(incidentId);
        if (found) {
          found.severity = data.severity as IncidentSeverityLevel;
          found.updatedAt = new Date().toISOString();
        }
        toast.success('Severity updated successfully.');
        router.push(`/incval/incidents/${incidentId}/details`);
        return;
      }

      if (
        incident.status === IncidentStatus.PENDING &&
        newStatus === IncidentStatus.VERIFIED
      ) {
        await incidentService.verifyIncident(
          incidentId,
          data.severity as IncidentSeverityLevel,
          data.workNotes
        );
      } else if (newStatus === IncidentStatus.REJECTED) {
        await incidentService.rejectIncident(
          incidentId,
          'Rejected',
          data.workNotes
        );
      } else {
        const result = await incidentService.updateIncidentStatus(
          incidentId,
          newStatus as IncidentStatus,
          data.workNotes,
          data.resolvedBy
        );
        if (result && data.severity !== incident.severity) {
          result.severity = data.severity as IncidentSeverityLevel;
        }
      }

      toast.success('Incident status updated successfully.');
      router.push(`/incval/incidents/${incidentId}/details`);
    } catch (error) {
      toast.error('Unable to update incident status.');
    }
  };

  if (isTerminal) {
    return (
      <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Status Transition</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              This incident is in a terminal state (
              <span className='font-medium'>{incident.status}</span>) and cannot
              be transitioned further.
            </p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() =>
                router.push(`/incval/incidents/${incidentId}/details`)
              }
            >
              Back to Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident #{incidentId}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-muted-foreground text-sm'>Title</p>
              <p className='font-medium'>{incident.title}</p>
            </div>
            <Separator />
            <div>
              <p className='text-muted-foreground text-sm'>Location</p>
              <p className='text-sm'>{incident.location}</p>
            </div>
            <Separator />
            <div>
              <p className='text-muted-foreground text-sm'>Status</p>
              <p className='font-medium'>{incident.status}</p>
            </div>
            <Separator />
            <div>
              <p className='text-muted-foreground text-sm'>Severity</p>
              <p className='font-medium'>{incident.severity}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
      <Card>
        <CardHeader>
          <CardTitle>Status Transition</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Form form={form} onSubmit={handleSubmit(handleFormSubmit)}>
            <p className='text-muted-foreground'>
              Select the next operational status and severity for this incident
              and provide a short work-log note describing the action taken.
            </p>

            <FormSelect
              control={form.control}
              name='severity'
              label='Severity Level'
              options={severityOptions}
              placeholder='Select severity level'
            />

            <FormSelect
              control={form.control}
              name='status'
              label='Incident Status'
              options={availableStatuses}
              placeholder='Select a new status'
            />

            {selectedStatus === IncidentStatus.RESOLVED && (
              <FormSelect
                control={form.control}
                name='resolvedBy'
                label='Resolved By'
                options={[
                  { value: 'field-team', label: 'Field Team' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'incident-command', label: 'Incident Command' }
                ]}
                placeholder='Choose who resolved this incident'
              />
            )}

            <FormTextarea
              control={form.control}
              name='workNotes'
              label='Work Notes'
              placeholder='Record observations, handoff notes, or action taken...'
              config={{ rows: 5, maxLength: 500 }}
            />

            <div className='flex justify-end gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() =>
                  router.push(`/incval/incidents/${incidentId}/details`)
                }
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Update Status'}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incident #{incidentId}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-muted-foreground text-sm'>Title</p>
            <p className='font-medium'>{incident.title}</p>
          </div>
          <Separator />
          <div>
            <p className='text-muted-foreground text-sm'>Description</p>
            <p className='text-sm'>{incident.description}</p>
          </div>
          <Separator />
          <div>
            <p className='text-muted-foreground text-sm'>Location</p>
            <p className='text-sm'>{incident.location}</p>
          </div>
          <Separator />
          <div>
            <p className='text-muted-foreground text-sm'>Current Status</p>
            <p className='font-medium'>{incident.status}</p>
          </div>
          <Separator />
          <div>
            <p className='text-muted-foreground text-sm'>Severity</p>
            <p className='font-medium'>{incident.severity}</p>
          </div>
          <Separator />
          <div>
            <p className='text-muted-foreground text-sm'>Incident Type</p>
            <p className='font-medium'>{incident.incidentType}</p>
          </div>
          <Separator />
          <div>
            <p className='text-muted-foreground text-sm'>Last Updated</p>
            <p>{new Date(incident.updatedAt).toLocaleString()}</p>
          </div>
          {incident.resolvedBy && (
            <>
              <Separator />
              <div>
                <p className='text-muted-foreground text-sm'>Resolved By</p>
                <p>{incident.resolvedBy}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Resolved At</p>
                <p>
                  {incident.resolvedAt
                    ? new Date(incident.resolvedAt).toLocaleString()
                    : 'Pending'}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
