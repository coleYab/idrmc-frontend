import { auth } from '@clerk/nextjs/server';
import { searchParamsCache } from '@/lib/searchparams';
import { IncidentsTable } from './incidents-tables';
import { fetchClientResponse } from '@/lib/fetch-client';
import { incidentService } from '@/services/incidentServices';
import { IncidentSchema, type Incident } from '../types';

export default async function IncidentsListingPage() {
  const { getToken } = await auth();
  const page = Number(searchParamsCache.get('page') ?? 1);
  const pageLimit = Number(searchParamsCache.get('perPage') ?? 10);

  const status = searchParamsCache.get('status');
  const severityLevel = searchParamsCache.get('severityLevel');
  const id = searchParamsCache.get('id');
  const incidentTitle = searchParamsCache.get('incidentTitle');
  const incidentType = searchParamsCache.get('incidentType');
  const location = searchParamsCache.get('location');

  const limit = pageLimit ?? 10;
  const offset = Math.max((page - 1) * limit, 0);

  let responseData: unknown[] = [];
  let totalItems: number | undefined;

  try {
    const response = await fetchClientResponse<unknown[]>(
      '/incidents',
      {
        params: {
          limit,
          offset,
          status: status ?? undefined,
          severity: severityLevel ?? undefined,
          type: incidentType ?? undefined,
          id: id ?? undefined,
          title: incidentTitle ?? undefined,
          location: location ?? undefined
        },
        cache: 'no-store'
      },
      getToken
    );

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
