import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { incvalInfo } from '@/config/incval-infoconfig';

export default function IncidentSummaryReportPage() {
  return (
    <IncvalPlaceholderPage
      title='Incident Summary Report'
      description='Quantitative reporting for frequency, type distribution, and timelines.'
      infoContent={incvalInfo.reportsIncidentSummary}
      dummyText='This page will provide charts and analytics for incident frequency, disaster categories, and operational efficiency metrics such as verification and response times.'
    />
  );
}
