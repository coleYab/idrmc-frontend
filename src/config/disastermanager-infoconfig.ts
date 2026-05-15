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

export const disastermanagerInfo = {
  dashboard: makeInfo(
    'Disaster Management Dashboard',
    'The central command center for disaster management operations.',
    'Use this page to monitor active disasters, coordinate response efforts, track resource allocation, and oversee regional disaster operations in one place.',
    'This page is optimized for strategic decision making and should be the primary interface for disaster management operations.'
  ),
  disastersActive: makeInfo(
    'Active Disasters',
    'Current disasters requiring active management and response.',
    'Monitor ongoing disaster situations, track response progress, and coordinate multi-agency operations from this centralized view.'
  ),
  alerts: makeInfo(
    'Broadcasted Alerts',
    'All disaster alerts that have been broadcasted to response teams and personnel.',
    'Review alert history, update alert statuses, and track the dissemination of critical disaster information to ensure proper incident management.'
  ),
  disastersResolved: makeInfo(
    'Resolved Disasters',
    'Archive of disasters that have been successfully managed.',
    'Review completed disaster operations for lessons learned, performance analysis, and historical reporting.'
  ),
  disastersMapOverview: makeInfo(
    'Disaster Map Overview',
    'Geographic visualization of all active and potential disaster zones.',
    'Use interactive maps to identify disaster hotspots, track response coverage, and plan resource deployment strategies.'
  ),
  disastersReports: makeInfo(
    'Disaster Reports',
    'Comprehensive reporting on disaster management activities.',
    'Generate detailed reports on response effectiveness, resource utilization, and disaster impact assessments.'
  )
};

export function getDisasterDetailsInfo(disasterId: string): InfobarContent {
  return makeInfo(
    `Disaster ${disasterId} Management`,
    'Comprehensive management view of a single disaster operation.',
    'Access detailed disaster data, response plans, and operational status updates for coordinated management.'
  );
}
