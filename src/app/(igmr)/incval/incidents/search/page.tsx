import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { incvalInfo } from '@/config/incval-infoconfig';

export default function IncidentsSearchPage() {
  return (
    <IncvalPlaceholderPage
      title='Advanced Incident Search'
      description='Query incidents with detailed multi-criteria filters.'
      infoContent={incvalInfo.incidentsSearch}
      dummyText='This page will offer advanced search controls for incident metadata, including date ranges, locations, coordinates, and reporter-specific identifiers.'
    />
  );
}
