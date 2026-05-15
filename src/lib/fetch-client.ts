/**
 * Generic Fetch Client for IDRMC Frontend
 * Handles JWT injection from Clerk and standardized response parsing.
 */

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    count?: number;
    [key: string]: any;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  meta?: ApiResponse<T[]>['meta'];
}

export interface FetchClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export async function fetchClient<T>(
  endpoint: string,
  options: FetchOptions = {},
  getToken?: () => Promise<string | null>
): Promise<T> {
  const response = await fetchClientResponse<T>(endpoint, options, getToken);
  return response.data;
}

export async function fetchClientResponse<T>(
  endpoint: string,
  options: FetchClientOptions = {},
  getToken?: () => Promise<string | null>
): Promise<ApiResponse<T>> {
  const { params, headers, ...rest } = options;

  // 1. Construct URL with query parameters
  const url = new URL(
    `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // 2. Prepare Headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (getToken) {
    const token = await getToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // 3. Perform Fetch
  const response = await fetch(url.toString(), {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers
    }
  });

  // 4. Handle Errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `API Error: ${response.status} ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return { data: undefined as T };
  }

  // 5. Parse Response
  const result = (await response.json()) as ApiResponse<T>;

  // Unwrap 'data' if it exists in the standard response format
  return result.data !== undefined
    ? result
    : ({ data: result as T } as ApiResponse<T>);
}
