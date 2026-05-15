import PageContainer from '@/components/layout/page-container';
import { ActiveDisastersClient } from '@/components/dashboard/ActiveDisastersClient';

export const metadata = {
  title: 'Active Disasters - Disaster Management'
};

export default function ActiveDisastersPage() {
  return (
    <PageContainer
      scrollable={true}
      pageTitle='Active Disasters'
      pageDescription='Currently active disasters requiring immediate response and coordination.'
    >
      <ActiveDisastersClient />
    </PageContainer>
  );
}
