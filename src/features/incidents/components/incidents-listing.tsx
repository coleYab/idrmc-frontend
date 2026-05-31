import { auth } from '@clerk/nextjs/server';
import { searchParamsCache } from '@/lib/searchparams';
import { IncidentsTable } from './incidents-tables';
import { fetchClientResponse } from '@/lib/fetch-client';
import { incidentService } from '@/services/incidentServices';
import { IncidentSchema, type Incident } from '../types';

export default async function IncidentsListingPage() {
  const { getToken } = await auth();

  const status = searchParamsCache.get('status');
  const severityLevel = searchParamsCache.get('severityLevel');
  const id = searchParamsCache.get('id');
  const incidentTitle = searchParamsCache.get('incidentTitle');
  const incidentType = searchParamsCache.get('incidentType');
  const location = searchParamsCache.get('location');

  let responseData: unknown[] = [];

  try {
    const response = await fetchClientResponse<unknown[]>(
      '/incidents',
      {
        params: {
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
  } catch (error) {
    const mockItems = await incidentService.getAll();
    responseData = mockItems;
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

  return <IncidentsTable data={items} totalItems={items.length} />;
}
