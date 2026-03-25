import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { incvalInfo } from '@/config/incval-infoconfig';

export default function IncidentsMapExplorerPage() {
  return (
    <IncvalPlaceholderPage
      title='Incident Map Explorer'
      description='Global incident visualization for pending, active, and resolved incidents.'
      infoContent={incvalInfo.incidentsMapExplorer}
      dummyText='This page will render a broad GIS map with clustered incident pins and density overlays to detect hotspots, trends, and geographic spread patterns.'
    />
  );
}
