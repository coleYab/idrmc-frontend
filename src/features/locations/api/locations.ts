import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  CreateLocationSchema,
  LocationSchema,
  UpdateLocationSchema,
  type CreateLocationDto,
  type Location,
  type LocationsListParams,
  type UpdateLocationDto
} from '../types';

const locationsListSchema = LocationSchema.array();

function parseLocation(data: unknown): Location {
  return LocationSchema.parse(data);
}

function parseLocations(data: unknown): Location[] {
  return locationsListSchema.parse(data);
}

export function useLocations(params?: LocationsListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.locations.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<Location[]>(
        '/locations',
        { params },
        getToken
      );

      return {
        items: parseLocations(response.data),
        meta: response.meta
      } satisfies PaginatedResult<Location>;
    }
  });
}

export function useLocation(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.locations.detail(id),
    queryFn: async () => {
      const data = await fetchClient<Location>(
        `/locations/${id}`,
        {},
        getToken
      );
      return parseLocation(data);
    },
    enabled: !!id
  });
}

export function useCreateLocation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLocationDto) => {
      const validatedPayload = CreateLocationSchema.parse(payload);

      const data = await fetchClient<Location>(
        '/locations',
        {
          method: 'POST',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseLocation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.root });
    }
  });
}

export function useUpdateLocation(id: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateLocationDto) => {
      const validatedPayload = UpdateLocationSchema.parse(payload);

      const data = await fetchClient<Location>(
        `/locations/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseLocation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.root });
      queryClient.invalidateQueries({
        queryKey: queryKeys.locations.detail(id)
      });
    }
  });
}

export function useDeleteLocation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchClient<void>(
        `/locations/${id}`,
        {
          method: 'DELETE'
        },
        getToken
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.root });
      queryClient.removeQueries({ queryKey: queryKeys.locations.detail(id) });
    }
  });
}
