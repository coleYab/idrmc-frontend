import { delay } from '@/constants/mock-api';
import { DisasterTypeChart } from '@/features/disasters/components/disaster-type-chart';

export default async function BarStats() {
  await delay(1000);
  return <DisasterTypeChart />;
}
