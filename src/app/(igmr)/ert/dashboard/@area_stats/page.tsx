import { delay } from '@/constants/mock-api';
import { ResourceUsageChart } from '@/features/ert/components/resource-usage-chart';

export default async function AreaStats() {
  await delay(2000);
  return <ResourceUsageChart />;
}
