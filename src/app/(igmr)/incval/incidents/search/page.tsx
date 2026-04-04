import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import IncidentsSearchListingPage from '@/features/incval/components/incidents-search-listing';
import { incvalInfo } from '@/config/incval-infoconfig';

export const metadata = {
  title: 'IDRMC - Incident Search'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function IncidentsSearchPage(props: PageProps) {
  const searchParams = await props.searchParams;

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Advanced Incident Search'
      pageDescription='Query incidents with detailed multi-criteria filters including date ranges, locations, and reporter information.'
      infoContent={incvalInfo.incidentsSearch}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <IncidentsSearchListingPage searchParams={searchParams} />
      </Suspense>
    </PageContainer>
  );
}
