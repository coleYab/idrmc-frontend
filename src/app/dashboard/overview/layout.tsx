import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React from 'react';

export default function OverViewLayout({
  recent_incidents,
  pie_stats,
  bar_stats,
  area_stats
}: {
  recent_incidents: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>
            ISDREM Command Center 🚨
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card border-red-500/20'>
            <CardHeader>
              <CardDescription>Active Disasters</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-500'>
                3
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className='text-red-500 border-red-500/30'>
                  <IconTrendingUp />
                  +1
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium text-red-500'>
                Critical state declared <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Requiring immediate resource deployment
              </div>
            </CardFooter>
          </Card>
          
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Pending Incidents</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                14
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingDown />
                  -5
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Down 5 from yesterday <IconTrendingDown className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Awaiting validator verification
              </div>
            </CardFooter>
          </Card>
          
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Active Alerts Sent</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                12
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  +4
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Increased public broadcast <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Across 2 primary regions
              </div>
            </CardFooter>
          </Card>
          
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Relief Deployed</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                1,204 T
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  +125 T
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Steady dispatch rate <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Food, water, and medical supplies
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {recent_incidents}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 min-h-0 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
