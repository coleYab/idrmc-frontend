import { z } from 'zod';

export const UserRoleEnum = z.enum(['Admin', 'User']).optional();

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: UserRoleEnum,
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional()
});

export type User = z.infer<typeof UserSchema>;

export const UpdateUserInputSchema = z
  .object({
    name: z.string().min(1).optional(),
    password: z.string().min(1).optional()
  })
  .refine((data) => data.name !== undefined || data.password !== undefined, {
    message: 'At least one field must be provided'
  });

export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;

export interface UsersListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
}
