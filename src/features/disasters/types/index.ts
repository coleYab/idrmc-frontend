import { z } from 'zod';
import { ReportIncidentShape } from '@/features/incidents/types';

const normalizeDisasterPayload = (rawData: unknown) => {
  if (typeof rawData !== 'object' || rawData === null) {
    return rawData;
  }

  const data = rawData as Record<string, unknown>;
  const incidentType = data.incidentType ?? data.type;
  const disasterType = data.disasterType ?? data.type;
  const affectedPopulationCount =
    data.affectedPopulationCount ?? data.totalAffectedPopulation;
  const allocatedBudget = data.allocatedBudget ?? data.budgetAllocated;
  const economicLoss = data.economicLoss ?? data.estimatedEconomicLoss;

  return {
    ...data,
    incidentType,
    disasterType,
    affectedPopulationCount,
    allocatedBudget,
    economicLoss
  };
};

export const DisasterTypeEnum = z.enum([
  'Flood',
  'Drought',
  'Landslide',
  'Locust',
  'Conflict',
  'Fire'
]);

export const DisasterStatusEnum = z.enum([
  'Pending',
  'Verified',
  'Active',
  'Resolved',
  'Repeated',
  'False Alarm',
  'Rejected'
]);

export const DisasterSeverityLevelEnum = z.enum([
  'Low',
  'Medium',
  'High',
  'Critical'
]);

const CreateDisasterShape = ReportIncidentShape.extend({
  allocatedBudget: z.number().nonnegative().optional(),
  economicLoss: z.number().nonnegative().optional(),
  linkedIncidentIds: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional()
});

export const CreateDisasterSchema = z.preprocess(
  normalizeDisasterPayload,
  CreateDisasterShape
);

export type CreateDisasterDto = z.infer<typeof CreateDisasterSchema>;

export const UpdateDisasterSchema = z.preprocess(
  normalizeDisasterPayload,
  CreateDisasterShape.partial()
);

export type UpdateDisasterDto = z.infer<typeof UpdateDisasterSchema>;

export const DisasterSchema = z.preprocess(
  normalizeDisasterPayload,
  CreateDisasterShape.extend({
    id: z.string(),
    disasterType: DisasterTypeEnum.optional(),
    status: DisasterStatusEnum,
    declaredBy: z.string(),
    reportedBy: z.string().optional(),
    activatedAt: z.iso.datetime().nullable().optional(),
    closedAt: z.iso.datetime().nullable().optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime()
  })
);

export type Disaster = z.infer<typeof DisasterSchema>;

export interface DisasterListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
  status?: string;
  severity?: string;
  type?: string;
}
