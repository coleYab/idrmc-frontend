import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  CreateNotificationSchema,
  NotificationSchema,
  UpdateNotificationSchema,
  type CreateNotificationDto,
  type Notification,
  type NotificationsListParams,
  type UpdateNotificationDto
} from '../types';

const notificationsListSchema = NotificationSchema.array();

function parseNotification(data: unknown): Notification {
  return NotificationSchema.parse(data);
}

function parseNotifications(data: unknown): Notification[] {
  return notificationsListSchema.parse(data);
}

export function useNotifications(params?: NotificationsListParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<Notification[]>(
        '/notifications',
        { params },
        getToken
      );

      return {
        items: parseNotifications(response.data),
        meta: response.meta
      } satisfies PaginatedResult<Notification>;
    }
  });
}

export function useNotification(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.notifications.detail(id),
    queryFn: async () => {
      const data = await fetchClient<Notification>(
        `/notifications/${id}`,
        {},
        getToken
      );

      return parseNotification(data);
    },
    enabled: !!id
  });
}

export function useCreateNotification() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateNotificationDto) => {
      const validatedPayload = CreateNotificationSchema.parse(payload);

      const data = await fetchClient<Notification>(
        '/notifications',
        {
          method: 'POST',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseNotification(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root });
    }
  });
}

export function useUpdateNotification(id: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateNotificationDto) => {
      const validatedPayload = UpdateNotificationSchema.parse(payload);

      const data = await fetchClient<Notification>(
        `/notifications/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseNotification(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.detail(id)
      });
    }
  });
}

export function useDeleteNotification() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetchClient<void>(
        `/notifications/${id}`,
        {
          method: 'DELETE'
        },
        getToken
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root });
      queryClient.removeQueries({
        queryKey: queryKeys.notifications.detail(id)
      });
    }
  });
}
