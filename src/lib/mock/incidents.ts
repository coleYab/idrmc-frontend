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
    description:
      'Heavy rainfall caused rivers to overflow, displacing thousands of residents.',
    incidentType: IncidentType.FLOOD,
    status: IncidentStatus.VERIFIED,
    severity: IncidentSeverityLevel.HIGH,
    location: 'Amhara Region, Ethiopia',
    latitude: 11.5,
    longitude: 39.5,
    attachments: ['https://via.placeholder.com/150'],
    affectedPopulationCount: 2500,
    requiresUrgentMedical: true,
    infrastructureDamage: ['Roads destroyed', 'Bridges collapsed'],
    reportedBy: 'anonymous',
    createdAt: '2026-04-06T12:00:00.000Z',
    updatedAt: '2026-04-06T12:00:00.000Z',
    resolvedBy: null,
    resolvedAt: null
  },

  {
    id: '2',
    title: 'Wildfire outbreak',
    description: 'Forest fire spreading rapidly across the highland forests.',
    incidentType: IncidentType.FIRE,
    status: IncidentStatus.ACTIVE,
    severity: IncidentSeverityLevel.CRITICAL,
    location: 'Oromia Region, Ethiopia',
    latitude: 8.5,
    longitude: 38.5,
    attachments: [],
    affectedPopulationCount: 1200,
    requiresUrgentMedical: false,
    infrastructureDamage: ['Forest destroyed'],
    reportedBy: 'user123',
    createdAt: '2026-04-10T12:00:00.000Z',
    updatedAt: '2026-04-10T12:00:00.000Z'
  },

  {
    id: '3',
    title: 'Minor Landslide',
    description: 'Small landslide blocking road access to remote villages.',
    incidentType: IncidentType.LANDSLIDE,
    status: IncidentStatus.RESOLVED,
    severity: IncidentSeverityLevel.LOW,
    location: 'Tigray Region, Ethiopia',
    latitude: 13.5,
    longitude: 39.5,
    attachments: [],
    affectedPopulationCount: 50,
    requiresUrgentMedical: false,
    infrastructureDamage: ['Road blocked'],
    reportedBy: 'anonymous',
    createdAt: '2026-03-30T12:00:00.000Z',
    updatedAt: '2026-03-30T12:00:00.000Z',
    resolvedBy: 'admin',
    resolvedAt: '2026-04-03T12:00:00.000Z'
  },

  {
    id: '4',
    title: 'Drought in Southern Region',
    description: 'Extended dry period affecting agriculture and livestock.',
    incidentType: IncidentType.DROUGHT,
    status: IncidentStatus.VERIFIED,
    severity: IncidentSeverityLevel.MEDIUM,
    location: 'Southern Nations Region, Ethiopia',
    latitude: 6.5,
    longitude: 37.5,
    attachments: [],
    affectedPopulationCount: 1800,
    requiresUrgentMedical: false,
    infrastructureDamage: ['Water supply affected'],
    reportedBy: 'local_authority',
    createdAt: '2026-04-11T12:00:00.000Z',
    updatedAt: '2026-04-11T12:00:00.000Z',
    resolvedBy: null,
    resolvedAt: null
  }
];
