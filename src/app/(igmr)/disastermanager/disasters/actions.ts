'use server';

import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus } from '@/lib/types/incident';
import { revalidatePath } from 'next/cache';

export async function updateDisasterStatus(id: string, newStatus: string) {
  const incident = mockIncidents.find((i) => i.id === id);
  if (!incident) {
    throw new Error('Disaster not found');
  }

  incident.status = newStatus as IncidentStatus;

  if (newStatus === IncidentStatus.RESOLVED) {
    incident.resolvedAt = new Date().toISOString();
    incident.resolvedBy = 'Current User (Admin)';
  }

  // Revalidate the disasters layout
  revalidatePath('/disastermanager/disasters', 'layout');

  return { success: true };
}
