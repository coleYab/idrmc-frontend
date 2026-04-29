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
    status: IncidentStatus.VERIFIED,
    severity: IncidentSeverityLevel.HIGH,
    location: 'Amhara Region, Ethiopia',
    attachments: ['https://via.placeholder.com/150'],
    affectedPopulationCount: 2500,
    requiresUrgentMedical: true,
    infrastructureDamage: ['Roads destroyed', 'Bridges collapsed'],
    reportedBy: 'anonymous',
    createdAt: '2026-04-06T12:00:00.000Z', // 7 days ago
    updatedAt: '2026-04-06T12:00:00.000Z',
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
    createdAt: '2026-04-10T12:00:00.000Z', // 3 days ago
    updatedAt: '2026-04-10T12:00:00.000Z'
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
    createdAt: '2026-03-30T12:00:00.000Z', // 14 days ago
    updatedAt: '2026-03-30T12:00:00.000Z',
    resolvedBy: 'admin',
    resolvedAt: '2026-04-03T12:00:00.000Z'
  },

  {
    id: '4',
    title: 'Drought in Southern Region',
    description: 'Extended dry period affecting agriculture.',
    incidentType: IncidentType.DROUGHT,
    status: IncidentStatus.VERIFIED,
    severity: IncidentSeverityLevel.MEDIUM,
    location: 'Southern Nations Region, Ethiopia',
    attachments: [],
    affectedPopulationCount: 1800,
    requiresUrgentMedical: false,
    infrastructureDamage: ['Water supply affected'],
    reportedBy: 'local_authority',
    createdAt: '2026-04-11T12:00:00.000Z', // 2 days ago
    updatedAt: '2026-04-11T12:00:00.000Z',
    resolvedBy: null,
    resolvedAt: null
  }
];
