import { z } from 'zod';

export const IncidentTypeEnum = z.enum([
  'Flood',
  'Drought',
  'Landslide',
  'Locust',
  'Conflict',
  'Fire'
]);

export const SeverityLevelEnum = z.enum(['Low', 'Medium', 'High', 'Critical']);

export const IncidentStatusEnum = z.enum([
  'Pending',
  'Verified',
  'Active',
  'Resolved',
  'Rejected'
]);

export const ReportIncidentSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  incidentType: IncidentTypeEnum,
  severity: SeverityLevelEnum,
  location: z.string(),
  affectedPopulationCount: z.number().int().min(0),
  requiresUrgentMedical: z.boolean().default(false),
  infrastructureDamage: z.array(z.string()).optional(),
  attachments: z.array(z.string().url()).optional()
});

export type ReportIncidentDto = z.infer<typeof ReportIncidentSchema>;

export const IncidentSchema = ReportIncidentSchema.extend({
  id: z.string().uuid(),
  status: IncidentStatusEnum,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  reportedBy: z.string(),
  resolvedBy: z.string().nullable().optional(),
  resolvedAt: z.iso.datetime().nullable().optional()
});

export type Incident = z.infer<typeof IncidentSchema>;

export const UpdateIncidentStatusSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED', 'RESOLVED'])
});

export type UpdateIncidentStatusDto = z.infer<
  typeof UpdateIncidentStatusSchema
>;

export const UpdateIncidentSchema = ReportIncidentSchema.partial();

export type UpdateIncidentDto = z.infer<typeof UpdateIncidentSchema>;

export interface IncidentListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
}
