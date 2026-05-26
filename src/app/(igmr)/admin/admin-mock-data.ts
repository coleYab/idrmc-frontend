import type { User } from '@/features/users/types';

export interface AdminUser extends User {
  phone: string;
  department: string;
  location: string;
  lastLogin: string;
  permissions: string[];
  manager: string;
}

export interface ActivityEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Failed';
}

export interface SystemStatus {
  uptime: string;
  failuresToday: number;
  configVersion: string;
  lastDeploy: string;
  nodesOnline: number;
  auditLogging: string;
  backupSchedule: string;
}

export interface SystemMetrics {
  apiResponseTime: {
    value: number;
    unit: string;
    status: 'excellent' | 'good' | 'warning' | 'critical';
  };
  databaseConnections: {
    active: number;
    max: number;
    status: 'healthy' | 'warning' | 'critical';
  };
  cpuUsage: {
    value: number;
    status: 'normal' | 'warning' | 'critical';
  };
  memoryUsage: {
    value: number;
    total: number;
    status: 'normal' | 'warning' | 'critical';
  };
  activeSessions: number;
  errorRate: {
    value: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
  };
  requestVolume: {
    perSecond: number;
    trend: 'up' | 'down' | 'stable';
  };
  cacheHitRate: number;
  diskUsage: {
    used: number;
    total: number;
    status: 'healthy' | 'warning' | 'critical';
  };
  lastHealthCheck: string;
}

export const sampleUsers: AdminUser[] = [
  {
    id: 'e6b56c1e-8dc3-4a7b-a8d7-9a551956a928',
    name: 'Alice Johnson',
    username: 'alice.johnson',
    email: 'alice.johnson@example.com',
    role: 'Admin',
    active: true,
    createdAt: '2024-05-14T09:24:00.000Z',
    updatedAt: '2026-05-22T15:42:00.000Z',
    phone: '+1 (410) 555-0147',
    department: 'Operations',
    location: 'Baltimore, MD',
    lastLogin: '2026-05-23T10:18:00.000Z',
    permissions: ['System settings', 'User management', 'Audit review'],
    manager: 'N/A'
  },
  {
    id: '919f796c-d12a-4bbb-ae5a-5728f70ca345',
    name: 'Noah Patel',
    username: 'noah.patel',
    email: 'noah.patel@example.com',
    role: 'User',
    active: true,
    createdAt: '2025-01-02T14:05:00.000Z',
    updatedAt: '2026-05-21T11:36:00.000Z',
    phone: '+1 (410) 555-0192',
    department: 'Response Planning',
    location: 'Annapolis, MD',
    lastLogin: '2026-05-23T08:52:00.000Z',
    permissions: ['Incident updates', 'Resource allocations'],
    manager: 'Alice Johnson'
  },
  {
    id: 'a2013cd8-8fd4-4a4f-9fcb-6c96aba0ba0f',
    name: 'Imani Lee',
    username: 'imani.lee',
    email: 'imani.lee@example.com',
    role: 'User',
    active: false,
    createdAt: '2025-06-08T12:18:00.000Z',
    updatedAt: '2026-02-10T16:09:00.000Z',
    phone: '+1 (410) 555-0123',
    department: 'Logistics',
    location: 'Columbia, MD',
    lastLogin: '2026-02-10T16:09:00.000Z',
    permissions: ['Inventory review'],
    manager: 'Noah Patel'
  },
  {
    id: 'be8fb5da-3f97-49e2-aa0c-4b618a038255',
    name: 'Diego Alvarez',
    username: 'diego.alvarez',
    email: 'diego.alvarez@example.com',
    role: 'User',
    active: true,
    createdAt: '2024-11-30T07:48:00.000Z',
    updatedAt: '2026-05-22T09:11:00.000Z',
    phone: '+1 (410) 555-0134',
    department: 'Monitoring',
    location: 'Towson, MD',
    lastLogin: '2026-05-23T09:10:00.000Z',
    permissions: ['Alert monitoring', 'Reporting'],
    manager: 'Alice Johnson'
  }
];

export const sampleActivities: ActivityEntry[] = [
  {
    id: 'act-001',
    user: 'Alice Johnson',
    action: 'Updated incident response threshold',
    target: 'System configuration',
    details: 'Raised the disaster alert trigger from 45% to 60%.',
    timestamp: '2026-05-23T10:05:00.000Z',
    status: 'Success'
  },
  {
    id: 'act-002',
    user: 'Noah Patel',
    action: 'Deactivated a user account',
    target: 'Imani Lee',
    details: 'Deactivated access after a prolonged inactivity period.',
    timestamp: '2026-05-22T16:42:00.000Z',
    status: 'Success'
  },
  {
    id: 'act-003',
    user: 'Diego Alvarez',
    action: 'Reviewed alert feed',
    target: 'Emergency alerts',
    details: 'Verified incoming alerts and confirmed data integrity.',
    timestamp: '2026-05-23T09:22:00.000Z',
    status: 'Success'
  },
  {
    id: 'act-004',
    user: 'Alice Johnson',
    action: 'Ran backup validation',
    target: 'Configuration backup',
    details: 'Verified last nightly backup and reported success.',
    timestamp: '2026-05-22T23:45:00.000Z',
    status: 'Success'
  },
  {
    id: 'act-005',
    user: 'Noah Patel',
    action: 'Resolved a system failure',
    target: 'Database sync',
    details: 'Addressed failed replication and reset queue.',
    timestamp: '2026-05-21T14:03:00.000Z',
    status: 'Warning'
  }
];

export const systemMetrics: SystemMetrics = {
  apiResponseTime: {
    value: 145,
    unit: 'ms',
    status: 'excellent'
  },
  databaseConnections: {
    active: 42,
    max: 100,
    status: 'healthy'
  },
  cpuUsage: {
    value: 34,
    status: 'normal'
  },
  memoryUsage: {
    value: 6.8,
    total: 16,
    status: 'normal'
  },
  activeSessions: 287,
  errorRate: {
    value: 0.12,
    status: 'excellent'
  },
  requestVolume: {
    perSecond: 342,
    trend: 'up'
  },
  cacheHitRate: 94.2,
  diskUsage: {
    used: 285,
    total: 500,
    status: 'healthy'
  },
  lastHealthCheck: '2026-05-23T10:45:00.000Z'
};

export const systemStatus: SystemStatus = {
  uptime: '14 days 6h 32m',
  failuresToday: 2,
  configVersion: 'v1.4.2',
  lastDeploy: 'May 22, 2026 02:15 UTC',
  nodesOnline: 8,
  auditLogging: 'Enabled',
  backupSchedule: 'Daily at 02:00 UTC'
};

export function getAdminUserById(id: string) {
  return sampleUsers.find((user) => user.id === id);
}

export function getUserActivityEntries(userName: string) {
  return sampleActivities.filter((activity) => activity.user === userName);
}
