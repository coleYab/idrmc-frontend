import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockIncidents } from '@/lib/mock/incidents';

export const metadata = { title: 'ERT - Medical Resources' };

const mockMedical = [
  {
    id: '1',
    resource: 'First Aid Kits',
    total: 50,
    available: 32,
    unit: 'kits'
  },
  { id: '2', resource: 'Stretchers', total: 20, available: 14, unit: 'units' },
  {
    id: '3',
    resource: 'Oxygen Tanks',
    total: 30,
    available: 18,
    unit: 'tanks'
  },
  {
    id: '4',
    resource: 'Defibrillators',
    total: 8,
    available: 5,
    unit: 'units'
  },
  {
    id: '5',
    resource: 'Medical Vehicles',
    total: 6,
    available: 3,
    unit: 'vehicles'
  },
  {
    id: '6',
    resource: 'Blood Supply (units)',
    total: 200,
    available: 145,
    unit: 'units'
  }
];

export default function MedicalPage() {
  const urgentCases = mockIncidents.filter((i) => i.requiresUrgentMedical);

  return (
    <div className='@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6'>
      <div>
        <h2 className='text-xl font-semibold'>Medical Resources</h2>
        <p className='text-muted-foreground text-sm'>
          Inventory and triage summary
        </p>
      </div>

      {urgentCases.length > 0 && (
        <Card className='border-destructive'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-destructive text-base'>
              Urgent Medical Cases ({urgentCases.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-1 text-sm'>
            {urgentCases.map((i) => (
              <div key={i.id} className='flex items-center justify-between'>
                <span>{i.title}</span>
                <Badge variant='destructive'>{i.location.split(',')[0]}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {mockMedical.map((item) => {
          const pct = Math.round((item.available / item.total) * 100);
          const variant =
            pct < 30 ? 'destructive' : pct < 60 ? 'secondary' : 'outline';
          return (
            <Card key={item.id}>
              <CardHeader className='pb-2'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base'>{item.resource}</CardTitle>
                  <Badge variant={variant}>{pct}%</Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-2 text-sm'>
                <p>
                  {item.available} / {item.total} {item.unit} available
                </p>
                <Progress value={pct} className='h-2' />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
