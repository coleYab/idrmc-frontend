import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  CreateDonationSchema,
  DonationSchema,
  UpdateDonationSchema,
  type CreateDonationDto,
  type Donation,
  type DonationsListParams,
  type UpdateDonationDto
} from '../types';

const donationsListSchema = DonationSchema.array();

function parseDonation(data: unknown): Donation {
  return DonationSchema.parse(data);
}

function parseDonations(data: unknown): Donation[] {
  return donationsListSchema.parse(data);
}

export function useDonations(params?: DonationsListParams) {
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

export function useCreateDonation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDonationDto) => {
      const validatedPayload = CreateDonationSchema.parse(payload);

      const data = await fetchClient<Donation>(
        '/donations',
        {
          method: 'POST',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseDonation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.donations.root });
    }
  });
}

export function useUpdateDonation(id: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDonationDto) => {
      const validatedPayload = UpdateDonationSchema.parse(payload);

      const data = await fetchClient<Donation>(
        `/donations/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseDonation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.donations.root });
      queryClient.invalidateQueries({
        queryKey: queryKeys.donations.detail(id)
      });
    }
  });
}

export function useDeleteDonation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchClient<void>(
        `/donations/${id}`,
        {
          method: 'DELETE'
        },
        getToken
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.donations.root });
      queryClient.removeQueries({ queryKey: queryKeys.donations.detail(id) });
    }
  });
}
