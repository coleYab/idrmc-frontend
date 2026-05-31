import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache } from '@/lib/searchparams';
import DisastersListingPage from '@/features/disasters/components/disasters-listing';

export const metadata = {
  title: 'All Disasters - Disaster Management'
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AllDisastersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='All Disasters'
      pageDescription='Complete list of all reported disaster events across all statuses.'
    >
      <Suspense
        key={searchParams.toString()}
        fallback={<DataTableSkeleton columnCount={7} rowCount={10} />}
      >
        <DisastersListingPage />
      </Suspense>
    </PageContainer>
  );
}
