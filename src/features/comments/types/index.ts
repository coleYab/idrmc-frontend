import { z } from 'zod';

export const CreateCommentSchema = z.object({
  disasterId: z.string().uuid(),
  content: z.string().min(1),
  attachments: z.array(z.string().url()).optional()
});

export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;

export const UpdateCommentSchema = z.object({
  content: z.string().min(1),
  attachments: z.array(z.string().url()).optional()
});

export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>;

export const CommentSchema = z.object({
  id: z.string().uuid(),
  disasterId: z.string().uuid(),
  content: z.string(),
  attachments: z.array(z.string().url()).optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional()
});

export type Comment = z.infer<typeof CommentSchema>;

export interface CommentsListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
}
