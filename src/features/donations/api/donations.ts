import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  CampaignSchema,
  CreateCampaignSchema,
  DonationSchema,
  DonationStatusResponseSchema,
  InitializeDonationResponseSchema,
  type Campaign,
  type CampaignListParams,
  type CreateCampaignDto,
  type Donation,
  type DonationStatusResponse,
  type InitializeDonationDto,
  type InitializeDonationResponse
} from '../types';

const donationsListSchema = DonationSchema.array();
const campaignsListSchema = CampaignSchema.array();

function parseDonation(data: unknown): Donation {
  return DonationSchema.parse(data);
}

function parseDonations(data: unknown): Donation[] {
  return donationsListSchema.parse(data);
}

function parseCampaign(data: unknown): Campaign {
  return CampaignSchema.parse(data);
}

function parseCampaigns(data: unknown): Campaign[] {
  return campaignsListSchema.parse(data);
}

// --- Legacy Donation Hooks (deprecated, use campaigns instead) ---

export function useDonations(params?: CampaignListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.donations.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<Donation[]>(
        '/donations',
        { params },
        getToken
      );

      return {
        items: parseDonations(response.data),
        meta: response.meta
      } satisfies PaginatedResult<Donation>;
    }
  });
}

export function useDonation(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.donations.detail(id),
    queryFn: async () => {
      const data = await fetchClient<Donation>(
        `/donations/${id}`,
        {},
        getToken
      );
      return parseDonation(data);
    },
    enabled: !!id
  });
}

// --- Campaign Hooks ---

export function useCampaigns(params?: CampaignListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.donations.campaigns.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<Campaign[]>(
        '/donations/campaigns',
        { params },
        getToken
      );

      return {
        items: parseCampaigns(response.data),
        meta: response.meta
      } satisfies PaginatedResult<Campaign>;
    }
  });
}

export function useCampaign(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.donations.campaigns.detail(id),
    queryFn: async () => {
      const data = await fetchClient<Campaign>(
        `/donations/campaigns/${id}`,
        {},
        getToken
      );
      return parseCampaign(data);
    },
    enabled: !!id
  });
}

export function useCreateCampaign() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCampaignDto) => {
      const validated = CreateCampaignSchema.parse(payload);
      const data = await fetchClient<Campaign>(
        '/donations/campaigns',
        {
          method: 'POST',
          body: JSON.stringify(validated)
        },
        getToken
      );
      return parseCampaign(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.donations.campaigns.root
      });
    }
  });
}

export function useUpdateCampaignStatus() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload
    }: {
      id: string;
      payload: { status: string; reason?: string };
    }) => {
      const data = await fetchClient<Campaign>(
        `/donations/campaigns/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload)
        },
        getToken
      );
      return parseCampaign(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.donations.campaigns.root
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.donations.campaigns.detail(variables.id)
      });
    }
  });
}

// --- Payment Hooks ---

export function useInitializeDonation() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (payload: InitializeDonationDto) => {
      const data = await fetchClient<InitializeDonationResponse>(
        '/donations/initialize',
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Idempotency-Key': crypto.randomUUID()
          }
        },
        getToken
      );
      return InitializeDonationResponseSchema.parse(data);
    }
  });
}

export function useDonationStatus(donationId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.donations.payment.status(donationId),
    queryFn: async () => {
      const data = await fetchClient<DonationStatusResponse>(
        `/donations/${donationId}/status`,
        {},
        getToken
      );
      return DonationStatusResponseSchema.parse(data);
    },
    enabled: !!donationId
  });
}
