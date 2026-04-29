import { z } from 'zod';

export const NotificationTypeEnum = z.enum(['email', 'sms', 'push', 'in_app']);

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  recipient: z.string(),
  type: NotificationTypeEnum,
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional()
});

export type Notification = z.infer<typeof NotificationSchema>;

export const CreateNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  recipient: z.string().min(1),
  type: NotificationTypeEnum
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationSchema>;

export const UpdateNotificationSchema = CreateNotificationSchema.partial();

export type UpdateNotificationDto = z.infer<typeof UpdateNotificationSchema>;

export interface NotificationsListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
}
