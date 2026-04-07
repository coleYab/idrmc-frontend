import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { searchParamsCache, type SearchParams } from '@/lib/searchparams';
import IncidentsListingPage from '@/features/incidents/components/incidents-listing';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export const metadata = {
  title: 'IDRMC - Incident Management'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function IncvalIncidentsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Incident Management'
      pageDescription='Review pending incidents, update statuses, and escalate issues.'
    >
      <Suspense
        key={searchParams.toString()}
        fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
      >
        <IncidentsListingPage />
      </Suspense>
    </PageContainer>
  );
}
