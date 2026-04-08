import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'ERT - Response Protocols' };

const protocols = [
  {
    id: '1',
    code: 'P-001',
    title: 'Flood Response Protocol',
    incidentType: 'Flood',
    priority: 'High',
    steps: [
      'Assess water levels and affected zones',
      'Deploy water rescue units',
      'Establish evacuation routes',
      'Set up temporary shelters',
      'Coordinate with local authorities'
    ]
  },
  {
    id: '2',
    code: 'P-002',
    title: 'Wildfire Response Protocol',
    incidentType: 'Fire',
    priority: 'Critical',
    steps: [
      'Determine fire perimeter and wind direction',
      'Evacuate civilians in fire path',
      'Deploy firefighting units',
      'Establish firebreaks',
      'Monitor for re-ignition'
    ]
  },
  {
    id: '3',
    code: 'P-003',
    title: 'Landslide Response Protocol',
    incidentType: 'Landslide',
    priority: 'Medium',
    steps: [
      'Secure the affected area',
      'Search and rescue trapped individuals',
      'Clear debris from roads',
      'Assess structural damage',
      'Relocate at-risk populations'
    ]
  },
  {
    id: '4',
    code: 'P-004',
    title: 'Mass Casualty Protocol',
    incidentType: 'General',
    priority: 'Critical',
    steps: [
      'Activate mass casualty incident (MCI) plan',
      'Triage casualties using START method',
      'Establish treatment zones (immediate, delayed, minor)',
      'Request additional medical support',
      'Coordinate hospital transfers'
    ]
  }
];

const priorityVariant = (p: string) =>
  p === 'Critical' ? 'destructive' : p === 'High' ? 'secondary' : 'outline';

export default function ProtocolsPage() {
  return (
    <div className='@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6'>
      <div>
        <h2 className='text-xl font-semibold'>Response Protocols</h2>
        <p className='text-muted-foreground text-sm'>
          Standard operating procedures for emergency response
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {protocols.map((protocol) => (
          <Card key={protocol.id}>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-base'>{protocol.title}</CardTitle>
                  <CardDescription>
                    {protocol.code} · {protocol.incidentType}
                  </CardDescription>
                </div>
                <Badge variant={priorityVariant(protocol.priority)}>
                  {protocol.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ol className='list-decimal space-y-1 pl-4 text-sm'>
                {protocol.steps.map((step, i) => (
                  <li key={i} className='text-muted-foreground'>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
