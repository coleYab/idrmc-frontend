import { z } from 'zod';

export const AuditLogEntrySchema = z.object({
  logID: z.number(),
  actionType: z.string(),
  resourceName: z.string(),
  details: z.string(),
  performedBy: z.number(),
  timestamp: z.string()
});

export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;

export interface AuditLogQueryParams {
  actionType?: string;
  resourceName?: string;
  performedBy?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
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
