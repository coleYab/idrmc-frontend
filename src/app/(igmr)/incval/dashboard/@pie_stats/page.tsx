import { delay } from '@/constants/mock-api';
import { PieGraph } from '@/features/overview/components/pie-graph';

export default async function PieStats() {
  await delay(1000);
  return <PieGraph />;
}
