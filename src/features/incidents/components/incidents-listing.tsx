import { searchParamsCache } from '@/lib/searchparams';
import { IncidentsTable } from './incidents-tables';
import { fakeIncidents } from '@/constants/mock-api';

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
  });

  const totalItems = data.total_items;
  const items = data.items;

  return <IncidentsTable data={items} totalItems={totalItems} />;
}
