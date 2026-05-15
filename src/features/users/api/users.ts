import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  UserSchema,
  type UpdateUserInput,
  type User,
  type UsersListParams
} from '../types';

const usersListSchema = UserSchema.array();

function parseUser(data: unknown): User {
  return UserSchema.parse(data);
}

function parseUsers(data: unknown): User[] {
  return usersListSchema.parse(data);
}

export function useMe() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: async () => {
      const data = await fetchClient<User>('/users/me', {}, getToken);
      return parseUser(data);
    }
  });
}

export function useUsers(params?: UsersListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<User[]>(
        '/users',
        { params },
        getToken
      );

      return {
        items: parseUsers(response.data),
        meta: response.meta
      } satisfies PaginatedResult<User>;
    }
  });
}

export function useUser(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const data = await fetchClient<User>(`/users/${id}`, {}, getToken);
      return parseUser(data);
    },
    enabled: !!id
  });
}

export function useUpdateUser(id: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserInput) => {
      const data = await fetchClient<User>(
        `/users/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload)
        },
        getToken
      );

      return parseUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
    }
  });
}
