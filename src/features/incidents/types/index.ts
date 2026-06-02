import { z } from 'zod';

const normalizeIncidentPayload = (rawData: unknown) => {
  if (typeof rawData !== 'object' || rawData === null) {
    return rawData;
  }

  const data = rawData as Record<string, unknown>;
  const incidentType = data.incidentType ?? data.type;
  const affectedPopulationCount =
    data.affectedPopulationCount ?? data.totalAffectedPopulation;

  return {
    ...data,
    incidentType,
    affectedPopulationCount
  };
};

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

export const ReportIncidentShape = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  incidentType: IncidentTypeEnum,
  severity: SeverityLevelEnum,
  location: z.string(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  affectedPopulationCount: z.number().int().min(0),
  requiresUrgentMedical: z.boolean().default(false),
  infrastructureDamage: z.array(z.string()).optional(),
  attachments: z.array(z.string().url()).optional()
});

export const ReportIncidentSchema = z.preprocess(
  normalizeIncidentPayload,
  ReportIncidentShape
);

export type ReportIncidentDto = z.infer<typeof ReportIncidentSchema>;

export const IncidentSchema = z.preprocess(
  normalizeIncidentPayload,
  z.object({
    id: z.string().nonempty(),
    title: z.string(),
    description: z.string(),
    incidentType: IncidentTypeEnum,
    status: IncidentStatusEnum,
    severity: SeverityLevelEnum,
    location: z.string(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    affectedPopulationCount: z.number().int().min(0),
    requiresUrgentMedical: z.boolean(),
    infrastructureDamage: z.array(z.string()).optional(),
    attachments: z.array(z.string()).optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    reportedBy: z.string(),
    resolvedBy: z.string().nullable().optional(),
    resolvedAt: z.iso.datetime().nullable().optional()
  })
);

export type Incident = z.infer<typeof IncidentSchema>;

export const UpdateIncidentStatusSchema = z.object({
  status: z.enum(['Verified', 'Active', 'Resolved', 'Rejected'])
});

export type UpdateIncidentStatusDto = z.infer<
  typeof UpdateIncidentStatusSchema
>;

export const UpdateIncidentSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  severity: SeverityLevelEnum.optional()
});

export type UpdateIncidentDto = z.infer<typeof UpdateIncidentSchema>;

export interface IncidentListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
  status?: string;
  severity?: string;
}
