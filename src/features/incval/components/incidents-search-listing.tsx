import { searchParamsCache } from '@/lib/searchparams';
import { IncidentsSearchTable } from './incidents-search-table';
import {
  incidentService,
  type IncidentSearchFilters
} from '@/services/incidentServices';
import {
  IncidentStatus,
  IncidentSeverityLevel,
  IncidentType
} from '@/lib/types/incident';

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
  const incidentType =
    incidentTypeRaw &&
    Object.values(IncidentType).includes(incidentTypeRaw as IncidentType)
      ? (incidentTypeRaw as IncidentType)
      : undefined;

  const severity =
    severityRaw &&
    Object.values(IncidentSeverityLevel).includes(
      severityRaw as IncidentSeverityLevel
    )
      ? (severityRaw as IncidentSeverityLevel)
      : undefined;

  const status =
    statusRaw &&
    Object.values(IncidentStatus).includes(statusRaw as IncidentStatus)
      ? (statusRaw as IncidentStatus)
      : undefined;

  // Parse boolean
  const requiresUrgentMedical =
    requiresUrgentMedicalRaw === 'true'
      ? true
      : requiresUrgentMedicalRaw === 'false'
        ? false
        : undefined;

  const filters: IncidentSearchFilters = {
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

  const filteredIncidents = await incidentService.advancedSearch(filters);

  return (
    <IncidentsSearchTable
      data={filteredIncidents}
      totalItems={filteredIncidents.length}
    />
  );
}
