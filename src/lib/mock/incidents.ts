import {
  Incident,
  IncidentStatus,
  IncidentSeverityLevel,
  IncidentType
} from '../types/incident';

export const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Severe Flood in Northern Region',
    description: 'Heavy rainfall caused rivers to overflow.',
    incidentType: IncidentType.FLOOD,
    status: IncidentStatus.PENDING,
    severity: IncidentSeverityLevel.HIGH,
    location: 'Amhara Region, Ethiopia',
    attachments: ['https://via.placeholder.com/150'],
    affectedPopulationCount: 2500,
    requiresUrgentMedical: true,
    infrastructureDamage: ['Roads destroyed', 'Bridges collapsed'],
    reportedBy: 'anonymous',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedBy: null,
    resolvedAt: null
  },

  {
    id: '2',
    title: 'Wildfire outbreak',
    description: 'Forest fire spreading rapidly.',
    incidentType: IncidentType.FIRE,
    status: IncidentStatus.ACTIVE,
    severity: IncidentSeverityLevel.CRITICAL,
    location: 'Oromia Region, Ethiopia',
    attachments: [],
    affectedPopulationCount: 1200,
    requiresUrgentMedical: false,
    infrastructureDamage: ['Forest destroyed'],
    reportedBy: 'user123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  {
    id: '3',
    title: 'Minor Landslide',
    description: 'Small landslide blocking road.',
    incidentType: IncidentType.LANDSLIDE,
    status: IncidentStatus.RESOLVED,
    severity: IncidentSeverityLevel.LOW,
    location: 'Tigray Region, Ethiopia',
    attachments: [],
    affectedPopulationCount: 50,
    requiresUrgentMedical: false,
    infrastructureDamage: ['Road blocked'],
    reportedBy: 'anonymous',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedBy: 'admin',
    resolvedAt: new Date().toISOString()
  }
];
