import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { IncidentsFilteredTable } from '@/features/incidents/components/incidents-tables';
import { incvalInfo } from '@/config/incval-infoconfig';

export const metadata = {
  title: 'Active Incidents'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function IncidentsActivePage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Active Incidents'
      pageDescription='Monitor currently verified incidents that are still in progress.'
      infoContent={incvalInfo.incidentsActive}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <IncidentsFilteredTable status='Active' />
      </Suspense>
    </PageContainer>
  );
}
