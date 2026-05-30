import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  AuditLogEntrySchema,
  SystemHealthSchema,
  SystemMetricsSchema,
  type AuditLogEntry,
  type AuditLogQueryParams,
  type SystemHealth,
  type SystemMetrics
} from '../types';

const auditLogListSchema = AuditLogEntrySchema.array();

function parseAuditLogEntry(data: unknown): AuditLogEntry {
  return AuditLogEntrySchema.parse(data);
}

function parseAuditLogEntries(data: unknown): AuditLogEntry[] {
  return auditLogListSchema.parse(data);
}

function parseSystemHealth(data: unknown): SystemHealth {
  return SystemHealthSchema.parse(data);
}

function parseSystemMetrics(data: unknown): SystemMetrics {
  return SystemMetricsSchema.parse(data);
}

export function useActivityLogs(params?: AuditLogQueryParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.admin.activity.list(params),
    queryFn: async () => {
      const response = await fetchClientResponse<AuditLogEntry[]>(
        '/audit-logs',
        { params },
        getToken
      );

      return {
        items: parseAuditLogEntries(response.data),
        meta: response.meta
      } satisfies PaginatedResult<AuditLogEntry>;
    }
  });
}

export function useActivityLog(id: number) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.admin.activity.list({ logID: id }),
    queryFn: async () => {
      const data = await fetchClient<AuditLogEntry>(
        `/audit-logs/${id}`,
        {},
        getToken
      );
      return parseAuditLogEntry(data);
    },
    enabled: !!id
  });
}

export function useSystemHealth() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.admin.health(),
    queryFn: async () => {
      const [health, metrics] = await Promise.all([
        fetchClient<SystemHealth>('/admin/system-health', {}, getToken),
        fetchClient<SystemMetrics>('/admin/system-metrics', {}, getToken)
      ]);
      return {
        health: parseSystemHealth(health),
        metrics: parseSystemMetrics(metrics)
      };
    }
  });
}
