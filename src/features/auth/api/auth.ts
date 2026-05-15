import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetch-client';
import {
  AuthTokensSchema,
  type AuthTokens,
  type LoginInput,
  type RefreshTokenInput,
  type RegisterInput
} from '../types';

function parseAuthTokens(data: unknown): AuthTokens {
  return AuthTokensSchema.parse(data);
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const data = await fetchClient<AuthTokens>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return parseAuthTokens(data);
    }
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginInput) => {
      const data = await fetchClient<AuthTokens>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return parseAuthTokens(data);
    }
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async (payload: RefreshTokenInput) => {
      const data = await fetchClient<AuthTokens>('/auth/refresh-token', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${payload.refreshToken}`
        },
        body: JSON.stringify(payload)
      });

      return parseAuthTokens(data);
    }
  });
}
