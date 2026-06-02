'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  IconMapPin,
  IconBuildingCommunity,
  IconUsers,
  IconAlertTriangle,
  IconArrowLeft
} from '@tabler/icons-react';
import { useDisaster } from '@/features/disasters/api/disasters';
import {
  IncidentLocationMap,
  getAffectedRadius
} from '@/features/incidents/components/incident-location-map';

const regionAdmin: Record<
  string,
  { capital: string; adminBody: string; population: string }
> = {
  amhara: {
    capital: 'Bahir Dar',
    adminBody: 'Amhara Regional State Government',
    population: '21.1 million'
  },
  oromia: {
    capital: 'Addis Ababa (Finfinne)',
    adminBody: 'Oromia Regional State Government',
    population: '35.5 million'
  },
  tigray: {
    capital: 'Mekelle',
    adminBody: 'Tigray Regional State Government',
    population: '5.7 million'
  },
  southern: {
    capital: 'Hawassa',
    adminBody: 'South Ethiopia Regional State Government',
    population: '12.5 million'
  },
  somali: {
    capital: 'Jijiga',
    adminBody: 'Somali Regional State Government',
    population: '6.2 million'
  },
  afar: {
    capital: 'Semera',
    adminBody: 'Afar Regional State Government',
    population: '2.1 million'
  },
  addis: {
    capital: 'Addis Ababa',
    adminBody: 'Addis Ababa City Administration',
    population: '5.2 million'
  }
};

function extractRegion(location: string): string {
  const locLower = location.toLowerCase();
  const known = [
    'amhara',
    'oromia',
    'tigray',
    'southern',
    'somali',
    'afar',
    'addis'
  ];
  for (const key of known) {
    if (locLower.includes(key)) return key;
  }
  return 'other';
}

export default function DisasterMapContextPage() {
  const params = useParams();
  const disasterId = params.disasterId as string;
  const { data: disaster, isLoading } = useDisaster(disasterId);

  if (isLoading) {
    return (
      <PageContainer scrollable={true}>
        <div className='flex items-center justify-center py-20'>
          <p className='text-muted-foreground'>Loading map context...</p>
        </div>
      </PageContainer>
    );
  }

  if (!disaster) {
    return (
      <PageContainer scrollable={true}>
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <IconAlertTriangle className='text-muted-foreground mb-4 size-12' />
            <h3 className='mb-2 text-lg font-semibold'>Disaster Not Found</h3>
            <p className='text-muted-foreground max-w-md text-center'>
              The disaster with ID &quot;{disasterId}&quot; was not found.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const regionKey = extractRegion(disaster.location);
  const adminInfo = regionAdmin[regionKey];
  const radiusKm = (getAffectedRadius(disaster) / 1000).toFixed(1);

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Map Context'
      pageDescription={`Geographic context for "${disaster.title}"`}
      pageHeaderAction={
        <Button asChild variant='outline'>
          <Link href={`/disastermanager/disasters/${disasterId}/details`}>
            <IconArrowLeft className='mr-2 size-4' />
            Back to Details
          </Link>
        </Button>
      }
    >
      <div className='grid gap-6 lg:grid-cols-5'>
        <div className='lg:col-span-3'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconMapPin className='size-5' />
                Affected Area
              </CardTitle>
              <CardDescription>
                Estimated impact zone — {radiusKm} km radius from disaster
                location
              </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              <IncidentLocationMap
                data={disaster as any}
                height={500}
                zoom={9}
              />
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6 lg:col-span-2'>
          {adminInfo ? (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <IconBuildingCommunity className='size-5' />
                  Administering Region
                </CardTitle>
                <CardDescription>
                  Regional authority responsible for this area
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-sm font-medium'>Region</p>
                  <p className='text-muted-foreground mt-0.5 text-sm capitalize'>
                    {regionKey === 'addis' ? 'Addis Ababa' : regionKey}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className='text-sm font-medium'>Administrative Body</p>
                  <p className='text-muted-foreground mt-0.5 text-sm'>
                    {adminInfo.adminBody}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className='text-sm font-medium'>Capital</p>
                  <p className='text-muted-foreground mt-0.5 text-sm'>
                    {adminInfo.capital}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className='text-sm font-medium'>Regional Population</p>
                  <p className='text-muted-foreground mt-0.5 text-sm'>
                    {adminInfo.population}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <IconBuildingCommunity className='size-5' />
                  Administering Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm'>
                  Region information is not available for this location.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconUsers className='size-5' />
                Disaster Impact
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Status</span>
                <Badge
                  variant={
                    disaster.status === 'Active' ? 'default' : 'secondary'
                  }
                >
                  {disaster.status}
                </Badge>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Severity</span>
                <Badge
                  variant={
                    disaster.severity === 'Critical' ||
                    disaster.severity === 'High'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {disaster.severity}
                </Badge>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Affected Population</span>
                <span className='text-sm font-semibold tabular-nums'>
                  {disaster.affectedPopulationCount.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Incident Type</span>
                <Badge variant='outline'>{disaster.incidentType}</Badge>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Location</span>
                <span className='text-muted-foreground text-right text-sm'>
                  {disaster.location}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
