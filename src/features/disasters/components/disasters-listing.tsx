import { auth } from '@clerk/nextjs/server';
import { searchParamsCache } from '@/lib/searchparams';
import { DisastersTable } from './disasters-tables';
import { fetchClientResponse } from '@/lib/fetch-client';
import { DisasterSchema, type Disaster } from '../types';

export default async function DisastersListingPage() {
  const { getToken } = await auth();

  const status = searchParamsCache.get('status');
  const severityLevel = searchParamsCache.get('severityLevel');
  const id = searchParamsCache.get('id');
  const incidentType = searchParamsCache.get('incidentType');
  const location = searchParamsCache.get('location');

  let responseData: unknown[] = [];

  try {
    const response = await fetchClientResponse<unknown[]>(
      '/disasters',
      {
        params: {
          status: status ?? undefined,
          severity: severityLevel ?? undefined,
          type: incidentType ?? undefined,
          id: id ?? undefined,
          location: location ?? undefined
        },
        cache: 'no-store'
      },
      getToken
    );

    responseData = response.data;
  } catch {
    responseData = [];
  }

  const parsedItems = DisasterSchema.array().safeParse(responseData);

  const items: Disaster[] = parsedItems.success
    ? parsedItems.data
    : responseData.reduce<Disaster[]>((acc, item) => {
        const parsedItem = DisasterSchema.safeParse(item);

        if (parsedItem.success) {
          acc.push(parsedItem.data);
        }

        return acc;
      }, []);

  return <DisastersTable data={items} totalItems={items.length} />;
}
