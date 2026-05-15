import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  // Incident search params
  id: parseAsString,
  description: parseAsString,
  location: parseAsString,
  incidentTitle: parseAsString,
  incidentType: parseAsString,
  severity: parseAsString,
  severityLevel: parseAsString,
  status: parseAsString,
  reportedBy: parseAsString,
  dateRange: parseAsArrayOf(parseAsString, ','),
  requiresUrgentMedical: parseAsString
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
