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
import { Incident, IncidentStatus } from '@/lib/types/incident';

const statusOptions: FormOption[] = Object.values(IncidentStatus).map(
  (status) => ({
    value: status,
    label: status
  })
);

const statusUpdateSchema = z
  .object({
    status: z.nativeEnum(IncidentStatus),
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

interface IncidentStatusUpdateFormProps {
  incident: Incident;
  incidentId: string;
}

export default function IncidentStatusUpdateForm({
  incident,
  incidentId
}: IncidentStatusUpdateFormProps) {
  const router = useRouter();

  const form = useForm<StatusUpdateFormData>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
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
      await incidentService.updateIncidentStatus(
        incidentId,
        data.status,
        data.workNotes,
        data.resolvedBy || undefined
      );
      toast.success('Incident status updated successfully.');
      router.push(`/incval/incidents/${incidentId}/details`);
    } catch (error) {
      console.error('Failed to update incident status:', error);
      toast.error('Unable to update incident status.');
    }
  };

  return (
    <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
      <Card>
        <CardHeader>
          <CardTitle>Status Transition</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Form form={form} onSubmit={handleSubmit(handleFormSubmit)}>
            <p className='text-muted-foreground'>
              Select the next operational status for this incident and provide a
              short work-log note describing the action taken.
            </p>

            <FormSelect
              control={form.control}
              name='status'
              label='Incident Status'
              options={statusOptions}
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
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-muted-foreground text-sm'>Current Status</p>
            <p className='font-medium'>{incident.status}</p>
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
