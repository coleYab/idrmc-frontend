import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { DisastersFilteredTable } from '@/features/disasters/components/disasters-tables';

export const metadata = {
  title: 'Resolved Disasters - Disaster Management'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ResolvedDisastersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Resolved Disasters'
      pageDescription='Historical record of resolved disaster events.'
    >
      <Suspense fallback={<div>Loading...</div>}>
        <DisastersFilteredTable status='Resolved' />
      </Suspense>
    </PageContainer>
  );
}
