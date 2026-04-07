import { mockIncidents } from '@/lib/mock/incidents';
import {
  IncidentStatus,
  IncidentSeverityLevel,
  IncidentType
} from '@/lib/types/incident';

export interface IncidentSearchFilters {
  title?: string;
  incidentType?: IncidentType;
  status?: IncidentStatus;
  severity?: IncidentSeverityLevel;
  location?: string;
  reportedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  requiresUrgentMedical?: boolean;
}

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

  advancedSearch: async (filters: IncidentSearchFilters) => {
    // If no filters are applied, return all incidents.
    const hasFilters = Object.values(filters).some((value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value))
        return value.some((item) => `${item}`.trim() !== '');
      return true;
    });

    if (!hasFilters) {
      return [...mockIncidents];
    }

    let results = [...mockIncidents];

    if (filters.title && filters.title.trim()) {
      results = results.filter((incident) =>
        incident.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }

    if (filters.incidentType && filters.incidentType.trim()) {
      results = results.filter(
        (incident) => incident.incidentType === filters.incidentType
      );
    }

    if (filters.status && filters.status.trim()) {
      results = results.filter(
        (incident) => incident.status === filters.status
      );
    }

    if (filters.severity && filters.severity.trim()) {
      results = results.filter(
        (incident) => incident.severity === filters.severity
      );
    }

    if (filters.location && filters.location.trim()) {
      results = results.filter((incident) =>
        incident.location
          .toLowerCase()
          .includes(filters.location!.toLowerCase())
      );
    }

    if (filters.reportedBy && filters.reportedBy.trim()) {
      results = results.filter((incident) =>
        incident.reportedBy
          .toLowerCase()
          .includes(filters.reportedBy!.toLowerCase())
      );
    }

    if (filters.dateFrom && filters.dateFrom.trim()) {
      const fromTimestamp = parseInt(filters.dateFrom);
      if (!isNaN(fromTimestamp)) {
        const fromDate = new Date(fromTimestamp);
        results = results.filter(
          (incident) => new Date(incident.createdAt) >= fromDate
        );
      }
    }

    if (filters.dateTo && filters.dateTo.trim()) {
      const toTimestamp = parseInt(filters.dateTo);
      if (!isNaN(toTimestamp)) {
        const toDate = new Date(toTimestamp);
        results = results.filter(
          (incident) => new Date(incident.createdAt) <= toDate
        );
      }
    }

    if (
      filters.requiresUrgentMedical !== undefined &&
      filters.requiresUrgentMedical !== null
    ) {
      results = results.filter(
        (incident) =>
          incident.requiresUrgentMedical === filters.requiresUrgentMedical
      );
    }

    return results;
  },

  updateIncidentStatus: async (
    id: string,
    status: IncidentStatus,
    notes: string,
    resolvedBy?: string
  ) => {
    const incident = mockIncidents.find((i) => i.id === id);
    if (incident) {
      incident.status = status;
      incident.updatedAt = new Date().toISOString();

      if (status === IncidentStatus.RESOLVED) {
        incident.resolvedBy = resolvedBy || 'incident-command';
        incident.resolvedAt = new Date().toISOString();
      } else {
        incident.resolvedBy = null;
        incident.resolvedAt = null;
      }

      // In a real app, you'd persist notes and audit history here.
      return incident;
    }
    throw new Error('Incident not found');
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
