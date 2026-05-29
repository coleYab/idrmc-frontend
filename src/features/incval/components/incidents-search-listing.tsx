import { IncidentsSearchTable } from './incidents-search-table';
import { fetchClientResponse } from '@/lib/fetch-client';
import {
  IncidentSchema,
  IncidentStatusEnum,
  IncidentTypeEnum,
  SeverityLevelEnum,
  type Incident
} from '@/features/incidents/types';
import { incidentService } from '@/services/incidentServices';
import type {
  IncidentStatus,
  IncidentType,
  IncidentSeverityLevel
} from '@/lib/types/incident';

interface IncidentsSearchListingPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function normalizeQueryValue(value?: string | string[]): string | undefined {
  if (!value) return undefined;

  const normalized = Array.isArray(value)
    ? value.filter(Boolean).join(' ')
    : String(value).trim();

  return normalized === '' ? undefined : normalized;
}

function parseBooleanQueryValue(
  value?: string | string[]
): boolean | undefined {
  const normalized = normalizeQueryValue(value);
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return undefined;
}

function normalizeDateRange(value?: string | string[]): string[] | undefined {
  const values = Array.isArray(value)
    ? value
    : (value?.split(',').map((item) => item.trim()) ?? []);

  const cleaned = values.filter((item) => item.length > 0);
  return cleaned.length > 0 ? cleaned : undefined;
}

function filterIncidents(
  incidents: Incident[],
  filters: {
    title?: string;
    incidentType?: string;
    severity?: string;
    status?: string;
    location?: string;
    reportedBy?: string;
    dateFrom?: string;
    dateTo?: string;
    requiresUrgentMedical?: boolean;
  }
) {
  return incidents.filter((incident) => {
    const matchesTokens = (field: string, value?: string) => {
      if (!value) return true;
      const tokens = value
        .split(/\s|,+/)
        .map((token) => token.trim())
        .filter(Boolean);
      return tokens.every((token) =>
        field.toLowerCase().includes(token.toLowerCase())
      );
    };

    if (!matchesTokens(incident.title, filters.title)) return false;
    if (!matchesTokens(incident.location, filters.location)) return false;
    if (!matchesTokens(incident.reportedBy, filters.reportedBy)) return false;

    if (filters.incidentType && incident.incidentType !== filters.incidentType)
      return false;

    if (filters.severity && incident.severity !== filters.severity)
      return false;

    if (filters.status && incident.status !== filters.status) return false;

    if (filters.requiresUrgentMedical !== undefined) {
      if (incident.requiresUrgentMedical !== filters.requiresUrgentMedical)
        return false;
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (isNaN(fromDate.getTime())) return false;
      if (new Date(incident.createdAt) < fromDate) return false;
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      if (isNaN(toDate.getTime())) return false;
      if (new Date(incident.createdAt) > toDate) return false;
    }

    return true;
  });
}

export default async function IncidentsSearchListingPage({
  searchParams
}: IncidentsSearchListingPageProps) {
  // Parse search params directly
  const title = normalizeQueryValue(searchParams.incidentTitle);
  const incidentTypeRaw = normalizeQueryValue(searchParams.incidentType);
  const severityRaw = normalizeQueryValue(searchParams.severity);
  const statusRaw = normalizeQueryValue(searchParams.status);
  const location = normalizeQueryValue(searchParams.location);
  const reportedBy = normalizeQueryValue(searchParams.reportedBy);
  const dateRange = normalizeDateRange(searchParams.dateRange);
  const dateFrom = dateRange && dateRange.length > 0 ? dateRange[0] : undefined;
  const dateTo = dateRange && dateRange.length > 1 ? dateRange[1] : undefined;
  const requiresUrgentMedical = parseBooleanQueryValue(
    searchParams.requiresUrgentMedical
  );

  // Parse enum values
  const incidentType = IncidentTypeEnum.safeParse(incidentTypeRaw).data;
  const severity = SeverityLevelEnum.safeParse(severityRaw).data;
  const status = IncidentStatusEnum.safeParse(statusRaw).data;

  const params = {
    limit: 200,
    offset: 0,
    title,
    incidentType,
    severity,
    status,
    location,
    reportedBy,
    dateFrom,
    dateTo,
    requiresUrgentMedical
  };

  let parsedIncidents: Incident[];

  try {
    const response = await fetchClientResponse<unknown[]>('/incidents', {
      params,
      cache: 'no-store'
    });

    parsedIncidents = IncidentSchema.array().parse(response.data);
  } catch (error) {
    const fallbackData = await incidentService.advancedSearch({
      title,
      incidentType: incidentType as IncidentType | undefined,
      severity: severity as IncidentSeverityLevel | undefined,
      status: status as IncidentStatus | undefined,
      location,
      reportedBy,
      dateFrom,
      dateTo,
      requiresUrgentMedical
    });

    parsedIncidents = IncidentSchema.array().parse(fallbackData);
  }

  const filteredIncidents = filterIncidents(parsedIncidents, {
    title,
    incidentType,
    severity,
    status,
    location,
    reportedBy,
    dateFrom,
    dateTo,
    requiresUrgentMedical
  });

  return (
    <IncidentsSearchTable
      data={
        filteredIncidents as Parameters<typeof IncidentsSearchTable>[0]['data']
      }
      totalItems={filteredIncidents.length}
    />
  );
}
