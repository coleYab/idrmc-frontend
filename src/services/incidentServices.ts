import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus, IncidentSeverityLevel } from '@/lib/types/incident';

export const incidentService = {
  getAll: async () => {
    return mockIncidents;
  },

  getByStatus: async (status: IncidentStatus) => {
    return mockIncidents.filter((i) => i.status === status);
  },

  getById: async (id: string) => {
    if (id === 'sample-001') {
      return mockIncidents[0];
    }

    return mockIncidents.find((i) => i.id === id);
  },

  search: async (query: string) => {
    return mockIncidents.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase())
    );
  },

  verifyIncident: async (
    id: string,
    severity: IncidentSeverityLevel,
    notes: string
  ) => {
    const incident = mockIncidents.find((i) => i.id === id);
    if (incident) {
      incident.status = IncidentStatus.VERIFIED;
      incident.severity = severity;
      incident.updatedAt = new Date().toISOString();
      // In a real app, you'd save assessment notes somewhere
      return incident;
    }
    throw new Error('Incident not found');
  },

  rejectIncident: async (id: string, reason: string, notes: string) => {
    const incident = mockIncidents.find((i) => i.id === id);
    if (incident) {
      incident.status = IncidentStatus.REJECTED;
      incident.updatedAt = new Date().toISOString();
      // In a real app, you'd save rejection reason and notes
      return incident;
    }
    throw new Error('Incident not found');
  }
};
