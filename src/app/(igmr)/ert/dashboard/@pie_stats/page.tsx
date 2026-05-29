import { delay } from '@/constants/mock-api';
import { ResourceDistributionChart } from '@/features/ert/components/resource-distribution-chart';

export default async function PieStats() {
  await delay(1000);
  return <ResourceDistributionChart />;
}
