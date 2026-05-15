import { IncidentsSearchTable } from './incidents-search-table';
import { fetchClientResponse } from '@/lib/fetch-client';
import {
  IncidentSchema,
  IncidentStatusEnum,
  IncidentTypeEnum,
  SeverityLevelEnum
} from '@/features/incidents/types';

interface IncidentsSearchListingPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function IncidentsSearchListingPage({
  searchParams
}: IncidentsSearchListingPageProps) {
  // Parse search params directly
  const title = searchParams.incidentTitle as string;
  const incidentTypeRaw = searchParams.incidentType as string;
  const severityRaw = searchParams.severity as string;
  const statusRaw = searchParams.status as string;
  const location = searchParams.location as string;
  const reportedBy = searchParams.reportedBy as string;
  const dateRange = searchParams.dateRange as string[];
  const dateFrom = dateRange && dateRange.length > 0 ? dateRange[0] : undefined;
  const dateTo = dateRange && dateRange.length > 1 ? dateRange[1] : undefined;
  const requiresUrgentMedicalRaw = searchParams.requiresUrgentMedical as string;

  // Parse enum values
  const incidentType = IncidentTypeEnum.safeParse(incidentTypeRaw).data;

  const severity = SeverityLevelEnum.safeParse(severityRaw).data;

  const status = IncidentStatusEnum.safeParse(statusRaw).data;

  // Parse boolean
  const requiresUrgentMedical =
    requiresUrgentMedicalRaw === 'true'
      ? true
      : requiresUrgentMedicalRaw === 'false'
        ? false
        : undefined;

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

  const response = await fetchClientResponse<unknown[]>('/incidents', {
    params,
    cache: 'no-store'
  });

  const filteredIncidents = IncidentSchema.array().parse(response.data);

  return (
    <IncidentsSearchTable
      data={
        filteredIncidents as Parameters<typeof IncidentsSearchTable>[0]['data']
      }
      totalItems={filteredIncidents.length}
    />
  );
}
