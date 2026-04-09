import { z } from 'zod';

export const LocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional()
});

export type Location = z.infer<typeof LocationSchema>;

export const CreateLocationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1)
});

export type CreateLocationDto = z.infer<typeof CreateLocationSchema>;

export const UpdateLocationSchema = CreateLocationSchema.partial();

export type UpdateLocationDto = z.infer<typeof UpdateLocationSchema>;

export interface LocationsListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
}
