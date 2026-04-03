import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { ResolvedIncidentsTable } from '@/features/incval/components/resolved-incidents-table';
import { incvalInfo } from '@/config/incval-infoconfig';

export const metadata = {
  title: 'Resolved Incidents'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function IncidentsResolvedPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Resolved Incidents'
      pageDescription='Searchable archive of incident records that are closed.'
      infoContent={incvalInfo.incidentsResolved}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResolvedIncidentsTable />
      </Suspense>
    </PageContainer>
  );
}
