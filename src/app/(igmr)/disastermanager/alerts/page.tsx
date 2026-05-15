import PageContainer from '@/components/layout/page-container';
import { disastermanagerInfo } from '@/config/disastermanager-infoconfig';
import AlertsClient from './alerts-client';

export const metadata = {
  title: 'Broadcasted Alerts - Disaster Management'
};

export default function AlertsPage() {
  return (
    <PageContainer
      scrollable={true}
      pageTitle='Broadcasted Alerts'
      pageDescription='All disaster alerts that have been broadcasted to response teams and personnel.'
      infoContent={disastermanagerInfo.alerts}
    >
      <AlertsClient />
    </PageContainer>
  );
}
