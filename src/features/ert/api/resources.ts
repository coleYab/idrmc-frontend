import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  InventoryItemSchema,
  ResourceNeedSchema,
  ResourceSchema,
  type InventoryItem,
  type InventoryListParams,
  type MapQueryParams,
  type Resource,
  type ResourceListParams,
  type ResourceNeed,
  type ResourceNeedListParams
} from '../types';

const resourcesListSchema = ResourceSchema.array();
const needsListSchema = ResourceNeedSchema.array();
const inventoryListSchema = InventoryItemSchema.array();

function parseResource(data: unknown): Resource {
  return ResourceSchema.parse(data);
}

function parseResources(data: unknown): Resource[] {
  return resourcesListSchema.parse(data);
}

function parseNeed(data: unknown): ResourceNeed {
  return ResourceNeedSchema.parse(data);
}

function parseNeeds(data: unknown): ResourceNeed[] {
  return needsListSchema.parse(data);
}

function parseInventoryItem(data: unknown): InventoryItem {
  return InventoryItemSchema.parse(data);
}

function parseInventoryItems(data: unknown): InventoryItem[] {
  return inventoryListSchema.parse(data);
}

// --- Resources ---

export function useResources(params?: ResourceListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.resources.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<Resource[]>(
        '/resources',
        { params },
        getToken
      );
      return {
        items: parseResources(response.data),
        meta: response.meta
      } satisfies PaginatedResult<Resource>;
    }
  });
}

export function useResource(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.resources.detail(id),
    queryFn: async () => {
      const data = await fetchClient<Resource>(
        `/resources/${id}`,
        {},
        getToken
      );
      return parseResource(data);
    },
    enabled: !!id
  });
}

export function useCreateResource() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: Pick<Resource, 'name' | 'category'> & { quantity: number }
    ) => {
      const data = await fetchClient<Resource>(
        '/resources',
        { method: 'POST', body: JSON.stringify(payload) },
        getToken
      );
      return parseResource(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.resources.list()
      });
    }
  });
}

// --- Resource Needs ---

export function useResourceNeeds(params?: ResourceNeedListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.needs.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<ResourceNeed[]>(
        '/resources/needs',
        { params },
        getToken
      );
      return {
        items: parseNeeds(response.data),
        meta: response.meta
      } satisfies PaginatedResult<ResourceNeed>;
    }
  });
}

export function useResourceNeed(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.needs.detail(id),
    queryFn: async () => {
      const data = await fetchClient<ResourceNeed>(
        `/resources/needs/${id}`,
        {},
        getToken
      );
      return parseNeed(data);
    },
    enabled: !!id
  });
}

export function useCreateResourceNeed() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<ResourceNeed, 'id' | 'status'>) => {
      const data = await fetchClient<ResourceNeed>(
        '/resources/needs',
        { method: 'POST', body: JSON.stringify(payload) },
        getToken
      );
      return parseNeed(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ert.needs.list() });
    }
  });
}

export function useUpdateNeedStatus() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const data = await fetchClient<ResourceNeed>(
        `/resources/needs/${id}/status`,
        { method: 'PATCH', body: JSON.stringify({ status }) },
        getToken
      );
      return parseNeed(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ert.needs.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.needs.detail(variables.id)
      });
    }
  });
}

export function useApproveNeed() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const data = await fetchClient<ResourceNeed>(
        `/resources/needs/${id}/approve`,
        { method: 'PATCH' },
        getToken
      );
      return parseNeed(data);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ert.needs.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.needs.detail(id)
      });
    }
  });
}

export function useAllocateResources() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      needId,
      lat,
      lon,
      radiusKm
    }: {
      needId: string;
      lat: number;
      lon: number;
      radiusKm?: number;
    }) => {
      const data = await fetchClient<ResourceNeed>(
        `/resources/needs/${needId}/allocate`,
        {
          method: 'POST',
          body: JSON.stringify({ lat, lon, radiusKm })
        },
        getToken
      );
      return parseNeed(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ert.needs.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.inventory.list()
      });
    }
  });
}

export function useDeleteResourceNeed() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchClient<void>(
        `/resources/needs/${id}`,
        { method: 'DELETE' },
        getToken
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ert.needs.list() });
      queryClient.removeQueries({
        queryKey: queryKeys.ert.needs.detail(id)
      });
    }
  });
}

// --- Inventory ---

export function useInventory(params?: InventoryListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.inventory.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<InventoryItem[]>(
        '/resources/inventory',
        { params },
        getToken
      );
      return {
        items: parseInventoryItems(response.data),
        meta: response.meta
      } satisfies PaginatedResult<InventoryItem>;
    }
  });
}

export function useInventoryItem(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.inventory.detail(id),
    queryFn: async () => {
      const data = await fetchClient<InventoryItem>(
        `/resources/inventory/${id}`,
        {},
        getToken
      );
      return parseInventoryItem(data);
    },
    enabled: !!id
  });
}

export function useCreateInventoryItem() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<InventoryItem, 'id'>) => {
      const data = await fetchClient<InventoryItem>(
        '/resources/inventory',
        { method: 'POST', body: JSON.stringify(payload) },
        getToken
      );
      return parseInventoryItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.inventory.list()
      });
    }
  });
}

export function useUpdateInventoryStock() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const data = await fetchClient<InventoryItem>(
        `/resources/inventory/${id}/stock`,
        { method: 'PATCH', body: JSON.stringify({ quantity }) },
        getToken
      );
      return parseInventoryItem(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.inventory.list()
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.inventory.detail(variables.id)
      });
    }
  });
}

export function useCheckAvailability(id: string, qty?: number) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.inventory.detail(id),
    queryFn: async () => {
      const params = qty ? { qty } : undefined;
      const data = await fetchClient<{ available: boolean; quantity: number }>(
        `/resources/inventory/${id}/availability`,
        { params },
        getToken
      );
      return data;
    },
    enabled: !!id
  });
}

export function useDeleteInventoryItem() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchClient<void>(
        `/resources/inventory/${id}`,
        { method: 'DELETE' },
        getToken
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ert.inventory.list()
      });
      queryClient.removeQueries({
        queryKey: queryKeys.ert.inventory.detail(id)
      });
    }
  });
}

export function useResourceMap(params?: MapQueryParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.ert.map.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<InventoryItem[]>(
        '/resources/map',
        { params },
        getToken
      );
      return {
        items: parseInventoryItems(response.data),
        meta: response.meta
      } satisfies PaginatedResult<InventoryItem>;
    }
  });
}
