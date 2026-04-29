import { searchParamsCache } from '@/lib/searchparams';
import { IncidentsTable } from './incidents-tables';
import { fetchClientResponse } from '@/lib/fetch-client';
import { IncidentSchema, type Incident } from '../types';

export default async function IncidentsListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name'); // Or search, depending on searchParams config
  const pageLimit = searchParamsCache.get('perPage');
  const status = searchParamsCache.get('status');
  const severity = searchParamsCache.get('severity');

  const limit = pageLimit ?? 10;
  const offset = Math.max((page - 1) * limit, 0);

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

  const parsedItems = IncidentSchema.array().safeParse(response.data);
  const items: Incident[] = parsedItems.success
    ? parsedItems.data
    : response.data.reduce<Incident[]>((acc, item) => {
        const parsedItem = IncidentSchema.safeParse(item);
        if (parsedItem.success) {
          acc.push(parsedItem.data);
        }
        return acc;
      }, []);

  const totalItems =
    response.meta?.total ?? response.meta?.count ?? items.length;

  return <IncidentsTable data={items} totalItems={totalItems} />;
}
