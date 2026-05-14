import { z } from 'zod';
import { ReportIncidentShape } from '@/features/incidents/types';

const normalizeDisasterPayload = (rawData: unknown) => {
  if (typeof rawData !== 'object' || rawData === null) {
    return rawData;
  }

  const data = rawData as Record<string, unknown>;
  const allocatedBudget = data.allocatedBudget ?? data.budgetAllocated;
  const economicLoss = data.economicLoss ?? data.estimatedEconomicLoss;

  return {
    ...data,
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

const CreateDisasterShape = ReportIncidentShape.extend({
  allocatedBudget: z.number().nonnegative().optional(),
  economicLoss: z.number().nonnegative().optional(),
  linkedIncidentIds: z.array(z.string().uuid()).optional()
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
    id: z.string().uuid(),
    disasterType: DisasterTypeEnum.optional(),
    status: z.string().optional(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional()
  })
);

export type Disaster = z.infer<typeof DisasterSchema>;
