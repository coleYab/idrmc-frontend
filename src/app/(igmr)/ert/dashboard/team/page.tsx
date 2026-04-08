import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'ERT - Team Status' };

const mockTeam = [
  {
    id: '1',
    name: 'Alpha Unit',
    lead: 'Abebe Girma',
    members: 5,
    status: 'deployed',
    location: 'Oromia Region'
  },
  {
    id: '2',
    name: 'Bravo Unit',
    lead: 'Tigist Haile',
    members: 4,
    status: 'available',
    location: 'Base Camp'
  },
  {
    id: '3',
    name: 'Charlie Unit',
    lead: 'Dawit Bekele',
    members: 6,
    status: 'deployed',
    location: 'Amhara Region'
  },
  {
    id: '4',
    name: 'Delta Unit',
    lead: 'Meron Tadesse',
    members: 4,
    status: 'off-duty',
    location: 'Base Camp'
  },
  {
    id: '5',
    name: 'Echo Unit',
    lead: 'Yonas Alemu',
    members: 5,
    status: 'available',
    location: 'Base Camp'
  }
];

const statusVariant = (s: string) =>
  s === 'deployed'
    ? 'destructive'
    : s === 'available'
      ? 'outline'
      : 'secondary';

export default function TeamPage() {
  return (
    <div className='@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6'>
      <div>
        <h2 className='text-xl font-semibold'>Team Status</h2>
        <p className='text-muted-foreground text-sm'>
          Current status of all ERT units
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {mockTeam.map((unit) => (
          <Card key={unit.id}>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-base'>{unit.name}</CardTitle>
                <Badge
                  variant={statusVariant(unit.status)}
                  className='capitalize'
                >
                  {unit.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-1 text-sm'>
              <p>
                Lead: <span className='font-medium'>{unit.lead}</span>
              </p>
              <p>
                Members: <span className='font-medium'>{unit.members}</span>
              </p>
              <p>
                Location: <span className='font-medium'>{unit.location}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
