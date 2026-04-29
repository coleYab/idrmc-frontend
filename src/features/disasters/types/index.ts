import { z } from 'zod';
import { ReportIncidentSchema } from '@/features/incidents/types';

export const DisasterTypeEnum = z.enum([
  'Flood',
  'Drought',
  'Landslide',
  'Locust',
  'Conflict',
  'Fire'
]);

export const CreateDisasterSchema = ReportIncidentSchema.extend({
  allocatedBudget: z.number().nonnegative().optional(),
  economicLoss: z.number().nonnegative().optional(),
  linkedIncidentIds: z.array(z.string().uuid()).optional()
});

export type CreateDisasterDto = z.infer<typeof CreateDisasterSchema>;

export const UpdateDisasterSchema = CreateDisasterSchema.partial();

export type UpdateDisasterDto = z.infer<typeof UpdateDisasterSchema>;

export const DisasterSchema = CreateDisasterSchema.extend({
  id: z.string().uuid(),
  disasterType: DisasterTypeEnum.optional(),
  status: z.string().optional(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional()
});

export type Disaster = z.infer<typeof DisasterSchema>;
