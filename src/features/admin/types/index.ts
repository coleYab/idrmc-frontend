import { z } from 'zod';

export const AdminActivityTypeEnum = z.enum([
  'Login',
  'Approve Incident',
  'Declare Disaster',
  'Allocate Resource',
  'Update Role',
  'System Alert',
  'Other'
]);

export const AdminActivitySchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  userName: z.string(),
  action: AdminActivityTypeEnum,
  target: z.string().optional(),
  description: z.string(),
  createdAt: z.string(),
  metadata: z.record(z.string(), z.string()).optional()
});

export type AdminActivityEntry = z.infer<typeof AdminActivitySchema>;

// Admin list params interface
export interface AdminListParams {
  [key: string]: string | number | boolean | undefined;
  limit?: number;
  offset?: number;
}

// System Health schemas
export const SystemMetricSchema = z.object({
  value: z.number(),
  unit: z.string().optional(),
  status: z.string().optional(),
  total: z.number().optional()
});

export type SystemMetric = z.infer<typeof SystemMetricSchema>;

export const SystemHealthSchema = z.object({
  uptime: z.string(),
  configVersion: z.string().optional(),
  lastDeploy: z.string().optional(),
  nodesOnline: z.number().optional(),
  auditLogging: z.string().optional(),
  backupSchedule: z.string().optional(),
  failuresToday: z.number().optional()
});

export type SystemHealth = z.infer<typeof SystemHealthSchema>;

export const SystemMetricsSchema = z.object({
  apiResponseTime: SystemMetricSchema.optional(),
  cpuUsage: SystemMetricSchema.optional(),
  memoryUsage: SystemMetricSchema.optional(),
  errorRate: SystemMetricSchema.optional(),
  cacheHitRate: z.number().optional(),
  databaseConnections: SystemMetricSchema.optional(),
  diskUsage: SystemMetricSchema.optional(),
  activeSessions: z.number().optional(),
  requestVolume: z
    .object({ perSecond: z.number().optional(), trend: z.string().optional() })
    .optional(),
  lastHealthCheck: z.string().optional()
});

export type SystemMetrics = z.infer<typeof SystemMetricsSchema>;

export const adminActivitySeed: AdminActivityEntry[] = [
  {
    id: 'log-1',
    userId: '2f8a04ea-0f96-4d5c-a4b5-6cfba5ae7581',
    userName: 'Martha Cole',
    action: 'Login',
    target: 'Auth Service',
    description: 'Signed in successfully from the headquarters network.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    metadata: { ip: '192.168.1.15', device: 'Chrome on Windows' }
  },
  {
    id: 'log-2',
    userId: '9e8f6f59-606a-4a29-9680-8397c74daba1',
    userName: 'Isaac Mendez',
    action: 'Approve Incident',
    target: 'Incident #A-3287',
    description:
      'Approved the incident report for river overflow and escalated response.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    metadata: { severity: 'High', region: 'Tbilisi' }
  },
  {
    id: 'log-3',
    userId: '1ab947f8-ac7d-4a1f-b523-fdb36b6e07a7',
    userName: 'Amina Patel',
    action: 'Declare Disaster',
    target: 'Flood Alert',
    description:
      'Declared a flood disaster for the western river basin after reviewing incident approvals.',
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    metadata: { region: 'Western Basin', priority: 'Critical' }
  },
  {
    id: 'log-4',
    userId: '2f8a04ea-0f96-4d5c-a4b5-6cfba5ae7581',
    userName: 'Martha Cole',
    action: 'Allocate Resource',
    target: 'Water trucks',
    description:
      'Allocated 12 water trucks to follow-up relief operation for the flood zone.',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    metadata: { quantity: '12', resourceType: 'Transport' }
  },
  {
    id: 'log-5',
    userId: '9e8f6f59-606a-4a29-9680-8397c74daba1',
    userName: 'Isaac Mendez',
    action: 'Update Role',
    target: 'User account: julia.fernandez',
    description: 'Promoted Julia Fernandez to System Administrator role.',
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    metadata: { previousRole: 'User', newRole: 'Admin' }
  },
  {
    id: 'log-6',
    userId: '1ab947f8-ac7d-4a1f-b523-fdb36b6e07a7',
    userName: 'Amina Patel',
    action: 'Login',
    target: 'Auth Service',
    description:
      'Logged in from a new device and confirmed two-factor authentication.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    metadata: { ip: '203.0.113.55', device: 'Safari on iPad' }
  },
  {
    id: 'log-7',
    userId: '2f8a04ea-0f96-4d5c-a4b5-6cfba5ae7581',
    userName: 'Martha Cole',
    action: 'Allocate Resource',
    target: 'Medical kits',
    description:
      'Allocated 80 emergency medical kits to the eastern field hospital.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    metadata: { quantity: '80', resourceType: 'Medical' }
  },
  {
    id: 'log-8',
    userId: '9e8f6f59-606a-4a29-9680-8397c74daba1',
    userName: 'Isaac Mendez',
    action: 'Approve Incident',
    target: 'Incident #B-5121',
    description:
      'Approved an evacuation incident after verifying shelter coordination.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: { region: 'South District', severity: 'Medium' }
  },
  {
    id: 'log-9',
    userId: '1ab947f8-ac7d-4a1f-b523-fdb36b6e07a7',
    userName: 'Amina Patel',
    action: 'System Alert',
    target: 'Permission audit',
    description:
      'Reviewed the last 24-hour permission change logs for administrative compliance.',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    metadata: { reviewType: 'Permission audit' }
  }
];
