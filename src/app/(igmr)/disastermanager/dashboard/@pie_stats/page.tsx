import { delay } from '@/constants/mock-api';
import { DisasterSeverityChart } from '@/features/disasters/components/disaster-severity-chart';

export default async function PieStats() {
  await delay(1000);
  return <DisasterSeverityChart />;
}
