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
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
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
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedBy: 'admin',
    resolvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];
