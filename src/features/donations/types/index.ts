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

export const CampaignStatusEnum = z.enum([
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'CLOSED'
]);

export const CampaignSchema = z.object({
  campaignID: z.string(),
  disasterID: z.string(),
  goalAmount: z.number().min(0.01),
  currentAmount: z.number(),
  currency: z.string().default('ETB'),
  status: CampaignStatusEnum,
  donationCount: z.number().int(),
  description: z.string(),
  progressPercentage: z.number().min(0).max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  closedAt: z.string().datetime().nullable().optional()
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const CreateCampaignSchema = z.object({
  disasterID: z.string(),
  goalAmount: z.number().min(0.01),
  currency: z.string().optional(),
  description: z.string().min(1)
});

export type CreateCampaignDto = z.infer<typeof CreateCampaignSchema>;

export const UpdateCampaignStatusSchema = z.object({
  status: CampaignStatusEnum,
  reason: z.string().optional()
});

export type UpdateCampaignStatusDto = z.infer<
  typeof UpdateCampaignStatusSchema
>;

export const DonorInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  isAnonymous: z.boolean()
});

export const InitializeDonationSchema = z.object({
  campaignID: z.string().uuid(),
  amount: z.number().min(0.01),
  currency: z.string(),
  donor: DonorInfoSchema
});

export type InitializeDonationDto = z.infer<typeof InitializeDonationSchema>;

export const InitializeDonationResponseSchema = z.object({
  checkoutUrl: z.string(),
  donationId: z.string(),
  tx_ref: z.string()
});

export type InitializeDonationResponse = z.infer<
  typeof InitializeDonationResponseSchema
>;

export const DonationStatusEnum = z.enum([
  'INITIALIZED',
  'PENDING_GATEWAY',
  'COMPLETED',
  'FAILED',
  'REFUNDED'
]);

export const DonationStatusResponseSchema = z.object({
  donationId: z.string().uuid(),
  status: DonationStatusEnum,
  failureReason: z.string().nullable().optional()
});

export type DonationStatusResponse = z.infer<
  typeof DonationStatusResponseSchema
>;

export interface CampaignListParams {
  status?: string;
  disasterId?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}
