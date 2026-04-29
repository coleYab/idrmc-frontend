import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  CreateDisasterSchema,
  DisasterSchema,
  UpdateDisasterSchema,
  type CreateDisasterDto,
  type Disaster,
  type UpdateDisasterDto
} from '../types';

const disastersListSchema = DisasterSchema.array();

function parseDisaster(data: unknown): Disaster {
  return DisasterSchema.parse(data);
}

function parseDisasters(data: unknown): Disaster[] {
  return disastersListSchema.parse(data);
}

export function useDisasters() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.disasters.list(),
    queryFn: async () => {
      const data = await fetchClient<Disaster[]>('/disasters', {}, getToken);
      return parseDisasters(data);
    }
  });
}

export function useDisaster(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.disasters.detail(id),
    queryFn: async () => {
      const data = await fetchClient<Disaster>(
        `/disasters/${id}`,
        {},
        getToken
      );
      return parseDisaster(data);
    },
    enabled: !!id
  });
}

export function useCreateDisaster() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDisasterDto) => {
      const validatedPayload = CreateDisasterSchema.parse(payload);

      const data = await fetchClient<Disaster>(
        '/disasters',
        {
          method: 'POST',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseDisaster(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.disasters.root });
    }
  });
}

export function useCreateDisasterFromIncident() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (incidentId: string) => {
      const data = await fetchClient<Disaster>(
        `/disasters/from/${incidentId}`,
        {
          method: 'POST'
        },
        getToken
      );

      return parseDisaster(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.disasters.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.root });
    }
  });
}

export function useUpdateDisaster(id: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDisasterDto) => {
      const validatedPayload = UpdateDisasterSchema.parse(payload);

      const data = await fetchClient<Disaster>(
        `/disasters/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseDisaster(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.disasters.root });
      queryClient.invalidateQueries({
        queryKey: queryKeys.disasters.detail(id)
      });
    }
  });
}
