// NOTE: The Medical Resources page is currently disabled from sidebar navigation.
// Resource allocation and inventory status are available through the Alerts and Resources dashboards.
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
  return (
    <PageContainer
      scrollable={true}
      pageTitle='Medical Resources'
      pageDescription='Inventory and triage summary for medical response resources.'
    >
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {mockMedical.map((item) => {
          const pct = Math.round((item.available / item.total) * 100);
          const variant =
            pct < 30 ? 'destructive' : pct < 60 ? 'secondary' : 'outline';
          return (
            <Card key={item.id}>
              <CardHeader className='pb-2'>
                <div className='flex items-center justify-between gap-3'>
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
    </PageContainer>
  );
}
