import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { IncidentMapExplorer } from '@/features/incidents/components/incident-map-explorer';
import { fetchClientResponse } from '@/lib/fetch-client';
import { auth } from '@clerk/nextjs/server';
import { incidentService } from '@/services/incidentServices';
import { IncidentSchema, type Incident } from '@/features/incidents/types';
import { IconMapPin } from '@tabler/icons-react';

export const metadata = {
  title: 'IDRMC - Incident Map Explorer'
};

export default async function IncidentsMapExplorerPage() {
  const { getToken } = await auth();

  let responseData: unknown[] = [];

  try {
    const response = await fetchClientResponse<unknown[]>(
      '/incidents',
      {
        params: { limit: 1000 },
        cache: 'no-store'
      },
      getToken
    );
    responseData = response.data;
  } catch {
    const mockItems = await incidentService.getAll();
    responseData = mockItems;
  }

  const parsedItems = IncidentSchema.array().safeParse(responseData);

  const items: Incident[] = parsedItems.success
    ? parsedItems.data
    : responseData.reduce<Incident[]>((acc, item) => {
        const parsedItem = IncidentSchema.safeParse(item);
        if (parsedItem.success) acc.push(parsedItem.data);
        return acc;
      }, []);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Incident Map Explorer'
      pageDescription='Global visualization of incidents with geographic clustering, density overlays, and hotspot detection.'
      pageHeaderAction={
        <div className='text-muted-foreground flex items-center gap-1 text-xs'>
          <IconMapPin className='h-3.5 w-3.5' />
          {items.length} incidents mapped
        </div>
      }
    >
      <Suspense
        fallback={
          <div className='bg-muted h-[600px] animate-pulse rounded-lg' />
        }
      >
        <IncidentMapExplorer incidents={items} />
      </Suspense>
    </PageContainer>
  );
}
