import { searchParamsCache } from '@/lib/searchparams';
import { IncidentsTable } from './incidents-tables';
import { fetchClientResponse, type ApiResponse } from '@/lib/fetch-client';
import { incidentService } from '@/services/incidentServices';
import { IncidentSchema, type Incident } from '../types';

export default async function IncidentsListingPage() {
  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');
  const status = searchParamsCache.get('status');
  const severityLevel = searchParamsCache.get('severityLevel');
  const id = searchParamsCache.get('id');
  const description = searchParamsCache.get('description');
  const location = searchParamsCache.get('location');

  const data = await fakeIncidents.getIncidents({
    page,
    limit: pageLimit,
    status: status ?? undefined,
    severity: severityLevel ?? undefined,
    id: id ?? undefined,
    description: description ?? undefined,
    location: location ?? undefined
  const limit = pageLimit ?? 10;
  const offset = Math.max((page - 1) * limit, 0);

  let responseData: unknown[];
  let totalItems: number | undefined;

  try {
    const response = await fetchClientResponse<unknown[]>('/incidents', {
      params: {
        limit,
        offset,
        status: status ?? undefined,
        severity: severity ?? undefined,
        search: search ?? undefined
      },
      cache: 'no-store'
    });

    responseData = response.data;
    totalItems = response.meta?.total ?? response.meta?.count;
  } catch (error) {
    const mockItems = await incidentService.getAll();
    responseData = mockItems;
    totalItems = mockItems.length;
  }

  const parsedItems = IncidentSchema.array().safeParse(responseData);
  const items: Incident[] = parsedItems.success
    ? parsedItems.data
    : responseData.reduce<Incident[]>((acc, item) => {
        const parsedItem = IncidentSchema.safeParse(item);
        if (parsedItem.success) {
          acc.push(parsedItem.data);
        }
        return acc;
      }, []);

  return (
    <IncidentsTable data={items} totalItems={totalItems ?? items.length} />
  );
}
