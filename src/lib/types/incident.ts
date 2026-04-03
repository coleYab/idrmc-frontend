export enum IncidentSeverityLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum IncidentStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  ACTIVE = 'Active',
  RESOLVED = 'Resolved',
  REPEATED = 'Repeated',
  FALSE_ALARM = 'False Alarm',
  REJECTED = 'Rejected'
}

export enum IncidentType {
  FLOOD = 'Flood',
  DROUGHT = 'Drought',
  LANDSLIDE = 'Landslide',
  LOCUST = 'Locust',
  CONFLICT = 'Conflict',
  FIRE = 'Fire'
}

export interface Incident {
  id: string;
  title: string;
  description: string;

  incidentType: IncidentType;
  status: IncidentStatus;
  severity: IncidentSeverityLevel;

  location: string;
  attachments: string[];

  affectedPopulationCount: number;
  requiresUrgentMedical: boolean;
  infrastructureDamage: string[];

  reportedBy: string;

  createdAt: string;
  updatedAt: string;

  resolvedBy?: string | null;
  resolvedAt?: string | null;
}
