import { z } from 'zod';

const normalizeDonationPayload = (rawData: unknown) => {
  if (typeof rawData !== 'object' || rawData === null) {
    return rawData;
  }

  const data = rawData as Record<string, unknown>;
  const id =
    (typeof data.id === 'string' && data.id) ||
    (typeof data.campaignID === 'string' && data.campaignID) ||
    (typeof data.campaignId === 'string' && data.campaignId) ||
    undefined;
  const title =
    (typeof data.title === 'string' && data.title) ||
    (typeof data.name === 'string' && data.name) ||
    (typeof data.campaignID === 'string' && data.campaignID) ||
    (typeof data.description === 'string' && data.description.slice(0, 50));
  const description = data.description ?? data.details ?? data.body;
  const goal = data.goalAmount ?? data.goal;
  const raised = data.currentAmount ?? data.current_amount ?? data.raised;
  const disasterId = data.disasterID ?? data.disasterId;
  const currency = data.currency;
  const status = data.status;
  const donationCount = data.donationCount ?? data.count;
  const progressPercentage = data.progressPercentage ?? data.progress;
  const closedAt = data.closedAt ?? data.closed_at;

  return {
    ...data,
    id,
    title,
    description,
    goal,
    raised,
    disasterId,
    currency,
    status,
    donationCount,
    progressPercentage,
    closedAt
  };
};

export const DonationSchema = z.preprocess(
  normalizeDonationPayload,
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().optional(),
    disasterId: z.string().uuid().optional(),
    goal: z.number().nonnegative().optional(),
    raised: z.number().nonnegative().optional(),
    currency: z.string().optional(),
    status: z.string().optional(),
    donationCount: z.number().int().nonnegative().optional(),
    progressPercentage: z.number().min(0).max(100).optional(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional(),
    closedAt: z.iso.datetime().nullable().optional()
  })
);

export type Donation = z.infer<typeof DonationSchema>;

const CreateDonationShape = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  disasterId: z.string().uuid().optional(),
  goal: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  status: z.string().optional()
});

export const CreateDonationSchema = z.preprocess(
  normalizeDonationPayload,
  CreateDonationShape
);

export type CreateDonationDto = z.infer<typeof CreateDonationSchema>;

export const UpdateDonationSchema = z.preprocess(
  normalizeDonationPayload,
  CreateDonationShape.partial()
);

export type UpdateDonationDto = z.infer<typeof UpdateDonationSchema>;

export interface DonationsListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
}
