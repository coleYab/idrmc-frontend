type QueryParams = Record<string, string | number | boolean | undefined>;

export const queryKeys = {
  auth: {
    root: ['auth'] as const
  },
  users: {
    root: ['users'] as const,
    me: () => ['users', 'me'] as const,
    list: (params?: QueryParams) => ['users', 'list', params ?? {}] as const,
    detail: (id: string) => ['users', 'detail', id] as const
  },
  incidents: {
    root: ['incidents'] as const,
    list: (params?: QueryParams) =>
      ['incidents', 'list', params ?? {}] as const,
    detail: (id: string) => ['incidents', 'detail', id] as const
  },
  disasters: {
    root: ['disasters'] as const,
    list: (params?: QueryParams) =>
      ['disasters', 'list', params ?? {}] as const,
    detail: (id: string) => ['disasters', 'detail', id] as const
  },
  comments: {
    root: ['comments'] as const,
    byDisaster: (disasterId: string, params?: QueryParams) =>
      ['comments', 'disaster', disasterId, params ?? {}] as const
  },
  donations: {
    root: ['donations'] as const,
    list: (params?: QueryParams) =>
      ['donations', 'list', params ?? {}] as const,
    detail: (id: string) => ['donations', 'detail', id] as const
  },
  locations: {
    root: ['locations'] as const,
    list: (params?: QueryParams) =>
      ['locations', 'list', params ?? {}] as const,
    detail: (id: string) => ['locations', 'detail', id] as const
  },
  notifications: {
    root: ['notifications'] as const,
    list: (params?: QueryParams) =>
      ['notifications', 'list', params ?? {}] as const,
    detail: (id: string) => ['notifications', 'detail', id] as const
  }
};
