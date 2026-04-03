import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IconAlertTriangle, IconMapPin, IconUsers } from '@tabler/icons-react';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentSeverityLevel, IncidentStatus } from '@/lib/types/incident';

interface DisasterSummaryProps {
  className?: string;
}

export function DisasterSummary({ className }: DisasterSummaryProps) {
  // Group incidents by region and calculate disaster levels
  const regionStats = mockIncidents.reduce(
    (acc, incident) => {
      // Extract region from location (assuming format "Region, Country")
      const region = incident.location.split(',')[0].trim();

      if (!acc[region]) {
        acc[region] = {
          total: 0,
          active: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          affectedPopulation: 0,
          incidents: []
        };
      }

      acc[region].total += 1;
      acc[region].affectedPopulation += incident.affectedPopulationCount;
      acc[region].incidents.push(incident);

      if (incident.status === IncidentStatus.ACTIVE) {
        acc[region].active += 1;
      }

      switch (incident.severity) {
        case IncidentSeverityLevel.CRITICAL:
          acc[region].critical += 1;
          break;
        case IncidentSeverityLevel.HIGH:
          acc[region].high += 1;
          break;
        case IncidentSeverityLevel.MEDIUM:
          acc[region].medium += 1;
          break;
        case IncidentSeverityLevel.LOW:
          acc[region].low += 1;
          break;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        total: number;
        active: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        affectedPopulation: number;
        incidents: typeof mockIncidents;
      }
    >
  );

  // Calculate disaster level based on severity and activity
  const calculateDisasterLevel = (stats: (typeof regionStats)[string]) => {
    const severityScore =
      stats.critical * 4 + stats.high * 3 + stats.medium * 2 + stats.low * 1;
    const activityMultiplier = stats.active > 0 ? 1.5 : 1;
    const totalScore = severityScore * activityMultiplier;

    if (totalScore >= 12)
      return { level: 'Critical', color: 'destructive' as const };
    if (totalScore >= 8)
      return { level: 'High', color: 'destructive' as const };
    if (totalScore >= 4)
      return { level: 'Medium', color: 'secondary' as const };
    return { level: 'Low', color: 'outline' as const };
  };

  const regions = Object.entries(regionStats).map(([region, stats]) => ({
    region,
    ...stats,
    disasterLevel: calculateDisasterLevel(stats)
  }));

  // Sort by disaster level (Critical first)
  regions.sort((a, b) => {
    const levelOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    return (
      levelOrder[b.disasterLevel.level as keyof typeof levelOrder] -
      levelOrder[a.disasterLevel.level as keyof typeof levelOrder]
    );
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconMapPin className='size-5' />
          Regional Disaster Summary
        </CardTitle>
        <CardDescription>
          Current disaster levels across different regions based on active
          incidents and severity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {regions.map((regionData) => (
            <div key={regionData.region} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <h4 className='font-medium'>{regionData.region}</h4>
                  <Badge variant={regionData.disasterLevel.color}>
                    {regionData.disasterLevel.level}
                  </Badge>
                </div>
                <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                  <IconUsers className='size-4' />
                  {regionData.affectedPopulation.toLocaleString()}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <div className='mb-1 flex justify-between'>
                    <span>Active Incidents</span>
                    <span>
                      {regionData.active}/{regionData.total}
                    </span>
                  </div>
                  <Progress
                    value={
                      (regionData.active / Math.max(regionData.total, 1)) * 100
                    }
                    className='h-2'
                  />
                </div>

                <div className='space-y-1'>
                  <div className='flex justify-between text-xs'>
                    <span>Critical</span>
                    <span>{regionData.critical}</span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <span>High</span>
                    <span>{regionData.high}</span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <span>Medium</span>
                    <span>{regionData.medium}</span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <span>Low</span>
                    <span>{regionData.low}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {regions.length === 0 && (
            <div className='text-muted-foreground py-8 text-center'>
              No regional data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
