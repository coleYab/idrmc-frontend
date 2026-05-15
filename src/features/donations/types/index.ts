import { z } from 'zod';

export const DonationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional()
});

export type Donation = z.infer<typeof DonationSchema>;

export const CreateDonationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1)
});

export type CreateDonationDto = z.infer<typeof CreateDonationSchema>;

export const UpdateDonationSchema = CreateDonationSchema.partial();

export type UpdateDonationDto = z.infer<typeof UpdateDonationSchema>;

export interface DonationsListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
}
