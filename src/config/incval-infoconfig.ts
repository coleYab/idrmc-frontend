import type { InfobarContent } from '@/components/ui/infobar';

function makeInfo(
  title: string,
  purpose: string,
  functionality: string,
  extra?: string
): InfobarContent {
  return {
    title,
    sections: [
      {
        title: 'Purpose',
        description: purpose
      },
      {
        title: 'How To Use',
        description: functionality
      },
      ...(extra
        ? [
            {
              title: 'Operational Notes',
              description: extra
            }
          ]
        : [])
    ]
  };
}

export const incvalInfo = {
  dashboard: makeInfo(
    'Incident Command Dashboard',
    'The central command center for all incident-related activities.',
    'Use this page to monitor pending vs active incidents, watch incoming report notifications, and track regional disaster levels in one place.',
    'This page is optimized for at-a-glance decision making and should be the first stop at the beginning of each shift.'
  ),
  incidentsPending: makeInfo(
    'Pending Incidents',
    'Inbox for all new, unverified incident reports.',
    'Review incoming reports, triage urgency, and begin the verification workflow from this queue.'
  ),
  incidentsActive: makeInfo(
    'Active Incidents',
    'Monitoring area for verified incidents that are still open.',
    'Track operational progress, monitor state transitions, and keep status updates synchronized across teams.'
  ),
  incidentsResolved: makeInfo(
    'Resolved Incidents',
    'Archive of incidents that have been fully closed.',
    'Search historical incidents for reporting, after-action review, and audit/compliance analysis.'
  ),
  incidentsMapExplorer: makeInfo(
    'Map Explorer',
    'Global visualization for Pending, Active, and Resolved incidents.',
    'Use clustered map pins to identify density hotspots, geographic patterns, and spread trends across regions.'
  ),
  incidentsSearch: makeInfo(
    'Incident Search',
    'Advanced query interface for targeted incident discovery.',
    'Filter by date ranges, geographic coordinates, reporter identifiers, and incident attributes for deep investigations.'
  ),
  reportsIncidentSummary: makeInfo(
    'Incident Summary Reports',
    'Quantitative overview of incident activity and performance.',
    'Generate charts and summary tables for incident frequency, disaster type mix, and verification/response timelines.'
  )
};

export function getIncidentDetailsInfo(incidentId: string): InfobarContent {
  return makeInfo(
    `Incident ${incidentId} Details`,
    'Comprehensive view of a single incident report.',
    'Inspect raw submission data including disaster type, coordinates, timestamps, textual notes, and attached media before verification actions.'
  );
}

export function getIncidentVerifyInfo(incidentId: string): InfobarContent {
  return makeInfo(
    `Incident ${incidentId} Verification`,
    'Formal verification and rejection workflow for one incident.',
    'Validate data integrity, assign severity, then verify or reject with traceable reason codes.'
  );
}

export function getIncidentUpdateStatusInfo(
  incidentId: string
): InfobarContent {
  return makeInfo(
    `Incident ${incidentId} Status Workflow`,
    'Lifecycle management for an active incident.',
    'Move incidents through operational states, add work-log notes, and maintain a full audit trail of status changes.'
  );
}

export function getIncidentMapContextInfo(incidentId: string): InfobarContent {
  return makeInfo(
    `Incident ${incidentId} Map Context`,
    'Spatial validation workspace for one incident.',
    'Overlay GIS context like hazard zones and administrative boundaries to validate geographic accuracy.'
  );
}