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
    detail: (id: string) => ['donations', 'detail', id] as const,
    campaigns: {
      root: ['donations', 'campaigns'] as const,
      list: (params?: QueryParams) =>
        ['donations', 'campaigns', 'list', params ?? {}] as const,
      detail: (id: string) => ['donations', 'campaigns', 'detail', id] as const
    },
    payment: {
      status: (id: string) => ['donations', 'payment', 'status', id] as const
    }
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
  },
  ert: {
    root: ['ert'] as const,
    units: {
      list: (params?: QueryParams) =>
        ['ert', 'units', 'list', params ?? {}] as const,
      detail: (id: string) => ['ert', 'units', 'detail', id] as const
    },
    map: {
      list: (params?: QueryParams) =>
        ['ert', 'map', 'list', params ?? {}] as const,
      nearby: (lat: number, lon: number, radius: number) =>
        ['ert', 'map', 'nearby', lat, lon, radius] as const
    },
    resources: {
      list: (params?: QueryParams) =>
        ['ert', 'resources', 'list', params ?? {}] as const,
      detail: (id: string) => ['ert', 'resources', 'detail', id] as const
    },
    needs: {
      list: (params?: QueryParams) =>
        ['ert', 'needs', 'list', params ?? {}] as const,
      detail: (id: string) => ['ert', 'needs', 'detail', id] as const
    },
    inventory: {
      list: (params?: QueryParams) =>
        ['ert', 'inventory', 'list', params ?? {}] as const,
      detail: (id: string) => ['ert', 'inventory', 'detail', id] as const
    }
  },
  admin: {
    root: ['admin'] as const,
    activity: {
      root: ['admin', 'activity'] as const,
      list: (params?: QueryParams) =>
        ['admin', 'activity', 'list', params ?? {}] as const
    },
    health: () => ['admin', 'health'] as const
  }
};
