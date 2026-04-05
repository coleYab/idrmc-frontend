import { delay } from '@/constants/mock-api';
import { RecentIncidents } from '@/features/overview/components/recent-incidents';

export default async function Incidents() {
  await delay(3000);
  return <RecentIncidents />;
}
