import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { incvalInfo } from '@/config/incval-infoconfig';

export default function IncidentsResolvedPage() {
  return (
    <IncvalPlaceholderPage
      title='Resolved Incidents'
      description='Searchable archive of incident records that are closed.'
      infoContent={incvalInfo.incidentsResolved}
      dummyText='This page will provide historical incident retrieval for audits, trend analysis, and after-action reporting across all resolved cases.'
    />
  );
}
