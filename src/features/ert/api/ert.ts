import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  ErtUnitSchema,
  type ErtListParams,
  type ErtUnit,
  type MapQueryParams
} from '../types';

const ertUnitListSchema = ErtUnitSchema.array();

function parseErtUnit(data: unknown): ErtUnit {
  return ErtUnitSchema.parse(data);
}

function parseErtUnits(data: unknown): ErtUnit[] {
  return ertUnitListSchema.parse(data);
}

export function useErtUnits(params?: ErtListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.units.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<ErtUnit[]>(
        '/ert',
        { params },
        getToken
      );

      return {
        items: parseErtUnits(response.data),
        meta: response.meta
      } satisfies PaginatedResult<ErtUnit>;
    }
  });
}

export function useErtUnit(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.units.detail(id),
    queryFn: async () => {
      const data = await fetchClient<ErtUnit>(`/ert/${id}`, {}, getToken);
      return parseErtUnit(data);
    },
    enabled: !!id
  });
}

export function useCreateErtUnit() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: Pick<ErtUnit, 'name'> & {
        region?: string;
        latitude?: number;
        longitude?: number;
      }
    ) => {
      const data = await fetchClient<ErtUnit>(
        '/ert',
        {
          method: 'POST',
          body: JSON.stringify(payload)
        },
        getToken
      );
      return parseErtUnit(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ert.units.list() });
    }
  });
}

export function useUpdateErtUnitStatus() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const data = await fetchClient<ErtUnit>(
        `/ert/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status })
        },
        getToken
      );
      return parseErtUnit(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ert.units.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.units.detail(variables.id)
      });
    }
  });
}

export function useUpdateErtUnitLocation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      latitude,
      longitude
    }: {
      id: string;
      latitude: number;
      longitude: number;
    }) => {
      const data = await fetchClient<ErtUnit>(
        `/ert/${id}/location`,
        {
          method: 'PATCH',
          body: JSON.stringify({ latitude, longitude })
        },
        getToken
      );
      return parseErtUnit(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ert.units.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.units.detail(variables.id)
      });
    }
  });
}

export function useDeleteErtUnit() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchClient<void>(`/ert/${id}`, { method: 'DELETE' }, getToken);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ert.units.list() });
      queryClient.removeQueries({
        queryKey: queryKeys.ert.units.detail(id)
      });
    }
  });
}

export function useErtMap(params?: MapQueryParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.map.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<ErtUnit[]>(
        '/ert-map',
        { params },
        getToken
      );
      return {
        items: parseErtUnits(response.data),
        meta: response.meta
      } satisfies PaginatedResult<ErtUnit>;
    }
  });
}

export function useErtMapNearby(
  lat: number,
  lon: number,
  radiusKm: number = 50
) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.map.nearby(lat, lon, radiusKm),
    queryFn: async () => {
      const response = await fetchClientResponse<ErtUnit[]>(
        '/ert-map/nearby',
        { params: { lat, lon, radiusKm } },
        getToken
      );
      return {
        items: parseErtUnits(response.data),
        meta: response.meta
      } satisfies PaginatedResult<ErtUnit>;
    },
    enabled: !!lat && !!lon
  });
}
