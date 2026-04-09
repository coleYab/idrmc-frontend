import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  IncidentSchema,
  type Incident,
  type IncidentListParams,
  type ReportIncidentDto,
  type UpdateIncidentDto,
  type UpdateIncidentStatusDto
} from '../types';

const incidentsListSchema = IncidentSchema.array();

function parseIncident(data: unknown): Incident {
  return IncidentSchema.parse(data);
}

function parseIncidents(data: unknown): Incident[] {
  return incidentsListSchema.parse(data);
}

/**
 * Hook to fetch all incidents with optional pagination
 */
export function useIncidents(params?: IncidentListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.incidents.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<Incident[]>(
        '/incidents',
        { params },
        getToken
      );

      return {
        items: parseIncidents(response.data),
        meta: response.meta
      } satisfies PaginatedResult<Incident>;
    }
  });
}

/**
 * Hook to fetch a single incident by ID
 */
export function useIncident(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.incidents.detail(id),
    queryFn: async () => {
      const data = await fetchClient<Incident>(
        `/incidents/${id}`,
        {},
        getToken
      );
      return parseIncident(data);
    },
    enabled: !!id
  });
}

/**
 * Hook to report a new incident
 */
export function useReportIncident() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReportIncidentDto) => {
      const result = await fetchClient<Incident>(
        '/incidents',
        {
          method: 'POST',
          body: JSON.stringify(data)
        },
        getToken
      );

      return parseIncident(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.root });
    }
  });
}

export function useUpdateIncident(id: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateIncidentDto) => {
      const data = await fetchClient<Incident>(
        `/incidents/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload)
        },
        getToken
      );

      return parseIncident(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.root });
      queryClient.invalidateQueries({
        queryKey: queryKeys.incidents.detail(id)
      });
    }
  });
}

export function useUpdateIncidentStatus(id: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateIncidentStatusDto) => {
      const data = await fetchClient<Incident>(
        `/incidents/${id}/resolve`,
        {
          method: 'PUT',
          body: JSON.stringify(payload)
        },
        getToken
      );

      return parseIncident(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.root });
      queryClient.invalidateQueries({
        queryKey: queryKeys.incidents.detail(id)
      });
    }
  });
}

export function useDeleteIncident() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchClient<void>(
        `/incidents/${id}`,
        {
          method: 'DELETE'
        },
        getToken
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.root });
      queryClient.removeQueries({ queryKey: queryKeys.incidents.detail(id) });
    }
  });
}
