import { delay } from '@/constants/mock-api';
import { DisasterTrendChart } from '@/features/disasters/components/disaster-trend-chart';

export default async function AreaStats() {
  await delay(2000);
  return <DisasterTrendChart />;
}
