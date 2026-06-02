import { z } from 'zod';

const normalizeNotificationPayload = (rawData: unknown) => {
  if (typeof rawData !== 'object' || rawData === null) {
    return rawData;
  }

  const data = rawData as Record<string, unknown>;
  const message = data.message ?? data.body ?? data.content;
  const title = data.title ?? data.alertTitle ?? data.name;
  const recipient = data.recipient ?? data.user ?? data.target;
  const type = data.type ?? data.notificationType ?? data.alertType;

  return {
    ...data,
    message,
    title,
    recipient,
    type
  };
};

export const NotificationTypeEnum = z.enum(['email', 'sms', 'push', 'in_app']);

export const NotificationSchema = z.preprocess(
  normalizeNotificationPayload,
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    message: z.string(),
    recipient: z.string(),
    type: NotificationTypeEnum,
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional()
  })
);

export type Notification = z.infer<typeof NotificationSchema>;

const CreateNotificationShape = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  recipient: z.string().min(1),
  type: NotificationTypeEnum
});

export const CreateNotificationSchema = z.preprocess(
  normalizeNotificationPayload,
  CreateNotificationShape
);

export type CreateNotificationDto = z.infer<typeof CreateNotificationSchema>;

export const UpdateNotificationSchema = z.preprocess(
  normalizeNotificationPayload,
  CreateNotificationShape.partial()
);

export type UpdateNotificationDto = z.infer<typeof UpdateNotificationSchema>;

export const BroadcastNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required')
});

export type BroadcastNotificationDto = z.infer<
  typeof BroadcastNotificationSchema
>;

export const BroadcastNotificationResponseSchema = z.object({
  totalUsers: z.number().optional(),
  pushSentCount: z.number().optional(),
  pushFailedCount: z.number().optional(),
  emailSentCount: z.number().optional(),
  emailFailedCount: z.number().optional()
});

export type BroadcastNotificationResponseDto = z.infer<
  typeof BroadcastNotificationResponseSchema
>;

export interface NotificationsListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
}
