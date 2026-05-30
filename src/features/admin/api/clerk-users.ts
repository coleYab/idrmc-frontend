import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  CreateClerkUserSchema,
  mapClerkUser,
  type CreateClerkUser,
  type ClerkUser
} from '@/features/admin/types/clerk-user';

async function fetchFromApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? 'Request failed');
  }
  return json.data;
}

export function useClerkUsers(search?: string) {
  const params = search ? `?q=${encodeURIComponent(search)}` : '';
  return useQuery({
    queryKey: queryKeys.admin.clerkUsers.list(search),
    queryFn: async () => {
      const data = await fetchFromApi<ClerkUser[]>(`/api/clerk/users${params}`);
      return { items: data };
    }
  });
}

export function useClerkUser(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.clerkUsers.detail(id),
    queryFn: () => fetchFromApi<ClerkUser>(`/api/clerk/users/${id}`),
    enabled: !!id
  });
}

export function useCreateClerkUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateClerkUser) => {
      const parsed = CreateClerkUserSchema.parse(payload);
      const res = await fetch('/api/clerk/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to create user');
      }
      return mapClerkUser(json.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.clerkUsers.root
      });
    }
  });
}

export function useUpdateClerkUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      roles,
      firstName,
      lastName
    }: {
      id: string;
      roles?: string[];
      firstName?: string;
      lastName?: string;
    }) => {
      const res = await fetch(`/api/clerk/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles, firstName, lastName })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to update user');
      }
      return mapClerkUser(json.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.clerkUsers.root
      });
    }
  });
}

export function useDeleteClerkUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/clerk/users/${id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to delete user');
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.clerkUsers.root
      });
    }
  });
}
