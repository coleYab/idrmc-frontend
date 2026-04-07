import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { PendingIncidentsVerifyTable } from '@/features/incval/components/pending-incidents-verify-table';
import { incvalInfo } from '@/config/incval-infoconfig';

export const metadata = {
  title: 'Verify Incidents'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function IncidentsVerifyPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Verify Incidents'
      pageDescription='Select a pending incident report to review and validate.'
      infoContent={incvalInfo.incidentsVerify}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <PendingIncidentsVerifyTable />
      </Suspense>
    </PageContainer>
  );
}
