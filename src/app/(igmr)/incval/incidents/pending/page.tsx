import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { PendingIncidentsTable } from '@/features/incval/components/pending-incidents-table';
import { incvalInfo } from '@/config/incval-infoconfig';

export const metadata = {
  title: 'Pending Incidents'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function IncidentsPendingPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Pending Incidents'
      pageDescription='Inbox of unverified incident reports awaiting validation.'
      infoContent={incvalInfo.incidentsPending}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <PendingIncidentsTable />
      </Suspense>
    </PageContainer>
  );
}
