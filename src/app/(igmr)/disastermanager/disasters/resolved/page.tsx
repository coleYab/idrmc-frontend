import PageContainer from '@/components/layout/page-container';
import { ResolvedDisastersClient } from '@/components/dashboard/ResolvedDisastersClient';

export const metadata = {
  title: 'Resolved Disasters - Disaster Management'
};

export default function ResolvedDisastersPage() {
  return (
    <PageContainer
      scrollable={true}
      pageTitle='Resolved Disasters'
      pageDescription='Historical record of resolved disaster events.'
    >
      <ResolvedDisastersClient />
    </PageContainer>
  );
}
