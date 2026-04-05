import { searchParamsCache } from '@/lib/searchparams';
import { IncidentsTable } from './incidents-tables';
import { fakeIncidents } from '@/constants/mock-api';

export default async function IncidentsListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name'); // Or search, depending on searchParams config
  const pageLimit = searchParamsCache.get('perPage');
  const status = searchParamsCache.get('status');
  const severity = searchParamsCache.get('severity');

  const data = await fakeIncidents.getIncidents({
    page,
    limit: pageLimit,
    status: status,
    severity: severity,
    search: search
  });

  const totalItems = data.total_items;
  const items = data.items;

  return <IncidentsTable data={items} totalItems={totalItems} />;
}
