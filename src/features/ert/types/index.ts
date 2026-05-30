import { z } from 'zod';

export const ErtUnitStatusEnum = z.enum(['IDLE', 'DEPLOYED', 'MAINTENANCE']);

export const ErtUnitSchema = z.object({
  unitID: z.string().uuid(),
  name: z.string(),
  status: ErtUnitStatusEnum,
  region: z.string().optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number()
    })
    .optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export type ErtUnit = z.infer<typeof ErtUnitSchema>;

export const ResourceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.string(),
  quantity: z.number().min(0)
});

export type Resource = z.infer<typeof ResourceSchema>;

export const ResourceNeedPriorityEnum = z.enum(['low', 'medium', 'high']);

export const ResourceNeedStatusEnum = z.enum([
  'pending',
  'in_progress',
  'satisfied'
]);

export const ResourceNeedSchema = z.object({
  id: z.string().uuid(),
  resourceID: z.string().uuid(),
  quantityRequired: z.number().min(1),
  priority: ResourceNeedPriorityEnum,
  incidentID: z.string().uuid().optional(),
  status: ResourceNeedStatusEnum.optional()
});

export type ResourceNeed = z.infer<typeof ResourceNeedSchema>;

export const InventoryItemSchema = z.object({
  id: z.string().uuid(),
  resourceID: z.string().uuid(),
  quantity: z.number().min(0),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number()
    })
    .optional()
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export interface ErtListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
  region?: string;
}

export interface ResourceListParams {
  category?: string;
  name?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ResourceNeedListParams {
  status?: string;
  priority?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface InventoryListParams {
  location?: string;
  radius?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface MapQueryParams {
  lat?: number;
  lon?: number;
  radiusKm?: number;
  [key: string]: string | number | boolean | undefined;
}
