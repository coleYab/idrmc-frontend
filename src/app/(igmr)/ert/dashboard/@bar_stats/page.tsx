import { delay } from '@/constants/mock-api';
import { ResourceAllocationChart } from '@/features/ert/components/resource-allocation-chart';

export default async function BarStats() {
  await delay(1000);
  return <ResourceAllocationChart />;
}
