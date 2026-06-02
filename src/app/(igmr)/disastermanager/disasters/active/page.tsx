import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { DisastersFilteredTable } from '@/features/disasters/components/disasters-tables';
import { BroadcastAlertDialog } from '@/features/disasters/components/broadcast-alert-dialog';

export const metadata = {
  title: 'Active Disasters - Disaster Management'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ActiveDisastersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Active Disasters'
      pageDescription='Currently active disasters requiring immediate response and coordination.'
      pageHeaderAction={<BroadcastAlertDialog />}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <DisastersFilteredTable status='Active' />
      </Suspense>
    </PageContainer>
  );
}
