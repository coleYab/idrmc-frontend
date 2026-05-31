'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormSelect } from '@/components/forms/form-select';
import { Badge } from '@/components/ui/badge';
import {
  IconAlertTriangle,
  IconMapPin,
  IconUsers,
  IconClock,
  IconUser,
  IconBuilding,
  IconCamera,
  IconArrowLeft,
  IconActivity,
  IconCheck
} from '@tabler/icons-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  useIncident,
  useUpdateIncident,
  useUpdateIncidentStatus
} from '@/features/incidents/api/incidents';
import {
  IncidentStatusEnum,
  SeverityLevelEnum
} from '@/features/incidents/types';
import { getIncidentDetailsInfo } from '@/config/incval-infoconfig';

const editFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description too long'),
  severity: z.string().min(1, 'Severity is required'),
  status: z.string().min(1, 'Status is required')
});

type EditFormData = z.infer<typeof editFormSchema>;

function formatDate(date?: string | null): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function getSeverityColor(severity: string) {
  const s = severity.toLowerCase();
  if (s === 'critical') return 'destructive';
  if (s === 'high') return 'destructive';
  if (s === 'medium') return 'secondary';
  if (s === 'low') return 'outline';
  return 'outline';
}

const statusOptions = IncidentStatusEnum.options
  .filter((s) => s !== 'Pending')
  .map((s) => ({ value: s, label: s }));

const severityOptions = SeverityLevelEnum.options.map((s) => ({
  value: s,
  label: s
}));

export default function IncidentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const incidentId = params.incidentId as string;

  const { data: incident, isLoading } = useIncident(incidentId);
  const updateDetails = useUpdateIncident(incidentId);
  const updateStatus = useUpdateIncidentStatus(incidentId);

  const form = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: '',
      description: '',
      severity: '',
      status: ''
    }
  });

  useEffect(() => {
    if (incident) {
      form.reset({
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        status: incident.status
      });
    }
  }, [incident, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!incident) return;

    try {
      const titleChanged = data.title !== incident.title;
      const descriptionChanged = data.description !== incident.description;
      const severityChanged = data.severity !== incident.severity;
      const statusChanged = data.status !== incident.status;

      if (titleChanged || descriptionChanged || severityChanged) {
        await updateDetails.mutateAsync({
          title: data.title,
          description: data.description,
          severity: data.severity as 'Low' | 'Medium' | 'High' | 'Critical'
        });
      }

      if (statusChanged) {
        await updateStatus.mutateAsync({
          status: data.status as 'Verified' | 'Active' | 'Resolved' | 'Rejected'
        });
      }

      if (
        !titleChanged &&
        !descriptionChanged &&
        !severityChanged &&
        !statusChanged
      ) {
        toast.info('No changes were made.');
        return;
      }

      toast.success('Incident updated successfully.');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update incident.');
    }
  });

  if (isLoading) {
    return (
      <PageContainer scrollable={true}>
        <div className='flex items-center justify-center py-20'>
          <p className='text-muted-foreground'>Loading incident details...</p>
        </div>
      </PageContainer>
    );
  }

  if (!incident) {
    return (
      <PageContainer
        scrollable={true}
        pageTitle='Incident Not Found'
        pageDescription='The requested incident could not be found.'
        pageHeaderAction={
          <Button asChild variant='outline'>
            <Link href='/incval/incidents'>
              <IconArrowLeft className='mr-2 size-4' />
              Back to Incidents
            </Link>
          </Button>
        }
      >
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <IconAlertTriangle className='text-muted-foreground mb-4 size-12' />
            <h3 className='mb-2 text-lg font-semibold'>Incident Not Found</h3>
            <p className='text-muted-foreground max-w-md text-center'>
              The incident with ID &quot;{incidentId}&quot; was not found. It
              may have been removed or you may not have access to it.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const infrastructureDamage = incident.infrastructureDamage ?? [];
  const attachments = incident.attachments ?? [];

  return (
    <PageContainer
      scrollable={true}
      pageTitle={`Incident ${incidentId}`}
      pageDescription='Edit incident details, severity, and status.'
      infoContent={getIncidentDetailsInfo(incidentId)}
      pageHeaderAction={
        <Button asChild variant='outline'>
          <Link href='/incval/incidents'>
            <IconArrowLeft className='mr-2 size-4' />
            Back to Incidents
          </Link>
        </Button>
      }
    >
      <Form form={form} onSubmit={handleSubmit}>
        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>Edit Incident</CardTitle>
                <CardDescription>
                  Update the name, description, severity, or status of this
                  incident.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormInput
                  control={form.control}
                  name='title'
                  label='Incident Name'
                  placeholder='Enter incident name'
                  required
                />

                <FormTextarea
                  control={form.control}
                  name='description'
                  label='Description'
                  placeholder='Enter incident description'
                  required
                  config={{ maxLength: 500, rows: 4 }}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormSelect
                    control={form.control}
                    name='severity'
                    label='Severity'
                    options={severityOptions}
                    placeholder='Select severity'
                    required
                  />

                  <FormSelect
                    control={form.control}
                    name='status'
                    label='Status'
                    options={statusOptions}
                    placeholder='Select status'
                    required
                  />
                </div>

                <div className='flex justify-end gap-3 pt-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                  <Button
                    type='submit'
                    disabled={updateDetails.isPending || updateStatus.isPending}
                  >
                    <IconCheck className='mr-2 size-4' />
                    {updateDetails.isPending || updateStatus.isPending
                      ? 'Saving...'
                      : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Actions</CardTitle>
                <CardDescription>
                  Access additional incident context and workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-3'>
                  <Button asChild variant='outline'>
                    <Link
                      href={`/incval/incidents/${incidentId}/update-status`}
                    >
                      Update Status
                    </Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link href={`/incval/incidents/${incidentId}/map-context`}>
                      View Map Context
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>
                  Read-only metadata about this incident
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <IconMapPin className='text-muted-foreground size-5' />
                  <div>
                    <p className='text-sm font-medium'>Location</p>
                    <p className='text-muted-foreground text-sm'>
                      {incident.location}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <IconUsers className='text-muted-foreground size-5' />
                  <div>
                    <p className='text-sm font-medium'>Affected Population</p>
                    <p className='text-muted-foreground text-sm'>
                      {incident.affectedPopulationCount.toLocaleString()} people
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <IconUser className='text-muted-foreground size-5' />
                  <div>
                    <p className='text-sm font-medium'>Reported By</p>
                    <p className='text-muted-foreground text-sm'>
                      {incident.reportedBy}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className='flex items-center gap-3'>
                  <IconClock className='text-muted-foreground size-5' />
                  <div>
                    <p className='text-sm font-medium'>Created</p>
                    <p className='text-muted-foreground text-sm'>
                      {formatDate(incident.createdAt)}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <IconClock className='text-muted-foreground size-5' />
                  <div>
                    <p className='text-sm font-medium'>Last Updated</p>
                    <p className='text-muted-foreground text-sm'>
                      {formatDate(incident.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <IconActivity className='text-muted-foreground size-5' />
                  <div>
                    <p className='text-sm font-medium'>Incident Type</p>
                    <p className='text-muted-foreground text-sm'>
                      {incident.incidentType}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Current Status</span>
                  <Badge variant='default' className='capitalize'>
                    {incident.status}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Severity Level</span>
                  <Badge variant={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Incident Type</span>
                  <Badge variant='outline'>{incident.incidentType}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <IconCamera className='size-5' />
                  Attachments
                </CardTitle>
                <CardDescription>
                  Photos, videos, and evidence files
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attachments.length === 0 ? (
                  <p className='text-muted-foreground py-4 text-center text-sm'>
                    No attachments uploaded
                  </p>
                ) : (
                  <div className='grid gap-3'>
                    {attachments.map((src, idx) => (
                      <div key={idx} className='relative'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Incident attachment ${idx + 1}`}
                          className='h-32 w-full rounded-md border object-cover'
                          loading='lazy'
                        />
                        <div className='absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white'>
                          Attachment {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Info</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {incident.resolvedBy ? (
                  <>
                    <div className='flex items-center gap-3'>
                      <IconUser className='text-muted-foreground size-5' />
                      <div>
                        <p className='text-sm font-medium'>Resolved By</p>
                        <p className='text-muted-foreground text-sm'>
                          {incident.resolvedBy}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <IconClock className='text-muted-foreground size-5' />
                      <div>
                        <p className='text-sm font-medium'>Resolved At</p>
                        <p className='text-muted-foreground text-sm'>
                          {formatDate(incident.resolvedAt)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className='text-muted-foreground text-sm'>
                    Not resolved yet
                  </p>
                )}
              </CardContent>
            </Card>

            {infrastructureDamage.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <IconBuilding className='size-5' />
                    Infrastructure Damage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-2'>
                    {infrastructureDamage.map((damage, index) => (
                      <div
                        key={index}
                        className='bg-muted/50 flex items-center gap-3 rounded-lg p-3'
                      >
                        <div className='h-2 w-2 rounded-full bg-red-500' />
                        <p className='text-sm'>{damage}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Form>
    </PageContainer>
  );
}
