'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormSelect, type FormOption } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormCheckbox } from '@/components/forms/form-checkbox';
import {
  FormRadioGroup,
  type RadioGroupOption
} from '@/components/forms/form-radio-group';
import { Form } from '@/components/ui/form';
import {
  Incident,
  IncidentSeverityLevel,
  IncidentStatus,
  IncidentType
} from '@/lib/types/incident';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { toast } from 'sonner';

// Validation schema for verification form
const verificationSchema = z
  .object({
    dataIntegrityConfirmed: z
      .boolean()
      .refine((val) => val === true, 'Data integrity must be confirmed'),
    disasterTypeAccurate: z
      .boolean()
      .refine(
        (val) => val === true,
        'Disaster type accuracy must be confirmed'
      ),
    coordinatesAccurate: z
      .boolean()
      .refine((val) => val === true, 'Coordinates accuracy must be confirmed'),
    severityLevel: z.nativeEnum(IncidentSeverityLevel),
    assessmentNotes: z
      .string()
      .min(10, 'Assessment notes must be at least 10 characters'),
    action: z.enum(['verify', 'reject']),
    rejectionReason: z.string().optional()
  })
  .refine(
    (data) => {
      if (
        data.action === 'reject' &&
        (!data.rejectionReason || data.rejectionReason.trim().length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Rejection reason is required when rejecting an incident',
      path: ['rejectionReason']
    }
  );

type VerificationFormData = z.infer<typeof verificationSchema>;

// Severity level options
const severityOptions: RadioGroupOption[] = [
  {
    value: IncidentSeverityLevel.LOW,
    label: 'Low - Minimal impact, routine response'
  },
  {
    value: IncidentSeverityLevel.MEDIUM,
    label: 'Medium - Moderate impact, coordinated response needed'
  },
  {
    value: IncidentSeverityLevel.HIGH,
    label: 'High - Significant impact, multi-agency response required'
  },
  {
    value: IncidentSeverityLevel.CRITICAL,
    label: 'Critical - Severe impact, national/international response needed'
  }
];

// Rejection reason options
const rejectionOptions: FormOption[] = [
  { value: 'false_alarm', label: 'False Alarm - No actual incident occurred' },
  {
    value: 'duplicate',
    label: 'Duplicate Report - Already reported elsewhere'
  },
  {
    value: 'insufficient_data',
    label: 'Insufficient Data - Missing critical information'
  },
  {
    value: 'outdated',
    label: 'Outdated Information - Incident already resolved'
  },
  {
    value: 'invalid_location',
    label: 'Invalid Location - Coordinates/data inaccurate'
  },
  { value: 'other', label: 'Other - Specify in notes' }
];

interface IncidentVerificationFormProps {
  incident: Incident;
  incidentId: string;
  onSubmit: (incidentId: string, data: VerificationFormData) => Promise<void>;
}

export default function IncidentVerificationForm({
  incident,
  incidentId,
  onSubmit
}: IncidentVerificationFormProps) {
  const router = useRouter();

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      dataIntegrityConfirmed: false,
      disasterTypeAccurate: false,
      coordinatesAccurate: false,
      severityLevel: IncidentSeverityLevel.LOW,
      assessmentNotes: '',
      action: 'verify',
      rejectionReason: ''
    }
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = form;
  const selectedAction = watch('action');

  const handleFormSubmit = async (data: VerificationFormData) => {
    try {
      await onSubmit(incidentId, data);
      toast.success(
        data.action === 'verify'
          ? 'Incident verified successfully!'
          : 'Incident rejected successfully!'
      );
      // Redirect back to verify incidents list
      router.push('/incval/incidents/verify');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const renderBadge = (type: IncidentType) => {
    const colors = {
      [IncidentType.FLOOD]: 'bg-blue-100 text-blue-800',
      [IncidentType.DROUGHT]: 'bg-yellow-100 text-yellow-800',
      [IncidentType.LANDSLIDE]: 'bg-orange-100 text-orange-800',
      [IncidentType.LOCUST]: 'bg-green-100 text-green-800',
      [IncidentType.CONFLICT]: 'bg-red-100 text-red-800',
      [IncidentType.FIRE]: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Incident Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5' />
            Incident Report Summary
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <h4 className='text-muted-foreground mb-1 text-sm font-medium'>
                Title
              </h4>
              <p className='font-medium'>{incident.title}</p>
            </div>
            <div>
              <h4 className='text-muted-foreground mb-1 text-sm font-medium'>
                Type
              </h4>
              {renderBadge(incident.incidentType)}
            </div>
            <div>
              <h4 className='text-muted-foreground mb-1 text-sm font-medium'>
                Location
              </h4>
              <div className='flex items-center gap-1'>
                <MapPin className='text-muted-foreground h-4 w-4' />
                <span>{incident.location}</span>
              </div>
            </div>
            <div>
              <h4 className='text-muted-foreground mb-1 text-sm font-medium'>
                Reported By
              </h4>
              <div className='flex items-center gap-1'>
                <User className='text-muted-foreground h-4 w-4' />
                <span>{incident.reportedBy}</span>
              </div>
            </div>
            <div>
              <h4 className='text-muted-foreground mb-1 text-sm font-medium'>
                Reported At
              </h4>
              <div className='flex items-center gap-1'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <span>{new Date(incident.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div>
              <h4 className='text-muted-foreground mb-1 text-sm font-medium'>
                Affected Population
              </h4>
              <span>{incident.affectedPopulationCount.toLocaleString()}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className='text-muted-foreground mb-2 text-sm font-medium'>
              Description
            </h4>
            <p className='text-sm leading-relaxed'>{incident.description}</p>
          </div>

          {incident.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className='text-muted-foreground mb-2 text-sm font-medium'>
                  Attachments
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {incident.attachments.map((attachment, index) => (
                    <Badge key={index} variant='outline'>
                      {attachment}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Verification Form */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={form}
            onSubmit={handleSubmit(handleFormSubmit)}
            className='space-y-6'
          >
            {/* Data Integrity Validation */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Data Integrity Validation</h3>
              <div className='space-y-3'>
                <FormCheckbox
                  control={form.control}
                  name='dataIntegrityConfirmed'
                  label='All reported data appears complete and internally consistent'
                />
                <FormCheckbox
                  control={form.control}
                  name='disasterTypeAccurate'
                  label={`Disaster type "${incident.incidentType}" accurately describes the incident`}
                />
                <FormCheckbox
                  control={form.control}
                  name='coordinatesAccurate'
                  label={`Location "${incident.location}" is accurate and properly geocoded`}
                />
              </div>
            </div>

            <Separator />

            {/* Severity Assessment */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Severity Assessment</h3>
              <p className='text-muted-foreground text-sm'>
                Based on population impact, infrastructure damage, and forecast
                data, assign the appropriate severity level.
              </p>
              <FormRadioGroup
                control={form.control}
                name='severityLevel'
                options={severityOptions}
                label='Severity Level'
              />
            </div>

            <Separator />

            {/* Assessment Notes */}
            <FormTextarea
              control={form.control}
              name='assessmentNotes'
              label='Assessment Notes'
              placeholder='Provide detailed reasoning for your severity assessment and any additional observations...'
              config={{ rows: 4 }}
            />

            <Separator />

            {/* Action Selection */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Verification Decision</h3>
              <div className='flex gap-4'>
                <Button
                  type='button'
                  variant={selectedAction === 'verify' ? 'default' : 'outline'}
                  onClick={() => setValue('action', 'verify')}
                  className='flex-1'
                >
                  <CheckCircle className='mr-2 h-4 w-4' />
                  Verify & Activate
                </Button>
                <Button
                  type='button'
                  variant={
                    selectedAction === 'reject' ? 'destructive' : 'outline'
                  }
                  onClick={() => setValue('action', 'reject')}
                  className='flex-1'
                >
                  <XCircle className='mr-2 h-4 w-4' />
                  Reject Report
                </Button>
              </div>

              {selectedAction === 'reject' && (
                <div className='space-y-3'>
                  <FormSelect
                    control={form.control}
                    name='rejectionReason'
                    label='Rejection Reason'
                    placeholder='Select rejection reason...'
                    options={rejectionOptions}
                  />
                  {errors.rejectionReason && (
                    <Alert variant='destructive'>
                      <AlertDescription>
                        {errors.rejectionReason.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='flex justify-end gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className={
                  selectedAction === 'verify'
                    ? 'bg-green-600 hover:bg-green-700'
                    : ''
                }
              >
                {isSubmitting
                  ? 'Processing...'
                  : selectedAction === 'verify'
                    ? 'Verify Incident'
                    : 'Reject Incident'}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
