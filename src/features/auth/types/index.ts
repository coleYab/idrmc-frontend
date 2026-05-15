import { z } from 'zod';

export const LoginInputSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const RegisterInputSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email()
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const RefreshTokenInputSchema = z.object({
  refreshToken: z.string().min(1)
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenInputSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export type AuthTokens = z.infer<typeof AuthTokensSchema>;
