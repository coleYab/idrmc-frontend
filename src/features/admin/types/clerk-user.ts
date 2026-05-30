import { z } from 'zod';

export const ROLE_OPTIONS = [
  'admin',
  'incident_validator',
  'disaster_response_team',
  'emergency_response_team',
  'user'
] as const;

export const RoleEnum = z.enum(ROLE_OPTIONS);
export type Role = z.infer<typeof RoleEnum>;

function toISOString(value: unknown): string | null {
  if (value === null || value === undefined) return 'unknown';
  if (typeof value === 'number') return new Date(value).toISOString();
  if (typeof value === 'string') return value;
  return 'unknown';
}

export const ClerkUserSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  emailAddress: z.string().email(),
  imageUrl: z.string(),
  roles: z.array(RoleEnum),
  banned: z.boolean(),
  createdAt: z.string(),
  lastSignInAt: z.string().nullable()
});

export type ClerkUser = z.infer<typeof ClerkUserSchema>;

export const CreateClerkUserSchema = z.object({
  emailAddress: z.string().email('Valid email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
  roles: z.array(RoleEnum).min(1, 'At least one role is required')
});

export type CreateClerkUser = z.infer<typeof CreateClerkUserSchema>;

export const UpdateClerkUserSchema = z.object({
  roles: z.array(RoleEnum).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional()
});

export type UpdateClerkUser = z.infer<typeof UpdateClerkUserSchema>;

export function mapClerkUser(data: Record<string, unknown>): ClerkUser {
  return ClerkUserSchema.parse({
    ...data,
    createdAt: toISOString(data.createdAt),
    lastSignInAt: toISOString(data.lastSignInAt)
  });
}

export function mapClerkUsers(data: Record<string, unknown>[]): ClerkUser[] {
  return data.map(mapClerkUser);
}
