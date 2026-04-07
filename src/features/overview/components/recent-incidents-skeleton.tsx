import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

export function RecentIncidentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Incidents</CardTitle>
        <CardDescription>
          There were 24 new reports filed this week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center w-full'>
              <Skeleton className='h-9 w-9 rounded-full' />
              <div className='ml-4 space-y-1 flex-1'>
                <Skeleton className='h-4 w-1/3' />
                <Skeleton className='h-3 w-1/2' />
              </div>
              <Skeleton className='h-4 w-16 ml-auto' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
