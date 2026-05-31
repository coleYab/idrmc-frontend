import { auth } from '@clerk/nextjs/server';
import { searchParamsCache } from '@/lib/searchparams';
import { DisastersTable } from './disasters-tables';
import { fetchClientResponse } from '@/lib/fetch-client';
import { DisasterSchema, type Disaster } from '../types';

export default async function DisastersListingPage() {
  const { getToken } = await auth();
  const page = Number(searchParamsCache.get('page') ?? 1);
  const pageLimit = Number(searchParamsCache.get('perPage') ?? 10);

  const status = searchParamsCache.get('status');
  const severityLevel = searchParamsCache.get('severityLevel');
  const id = searchParamsCache.get('id');
  const incidentType = searchParamsCache.get('incidentType');
  const location = searchParamsCache.get('location');

  const limit = pageLimit ?? 10;
  const offset = Math.max((page - 1) * limit, 0);

  let responseData: unknown[] = [];
  let totalItems: number | undefined;

  try {
    const response = await fetchClientResponse<unknown[]>(
      '/disasters',
      {
        params: {
          limit,
          offset,
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
    totalItems = response.meta?.total ?? response.meta?.count;
  } catch {
    responseData = [];
    totalItems = 0;
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

  return (
    <DisastersTable data={items} totalItems={totalItems ?? items.length} />
  );
}
