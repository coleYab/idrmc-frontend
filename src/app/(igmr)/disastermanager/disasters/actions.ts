'use server';

import { auth } from '@clerk/nextjs/server';
import { fetchClient } from '@/lib/fetch-client';
import { revalidatePath } from 'next/cache';

export async function updateDisasterStatus(id: string, newStatus: string) {
  const { getToken } = await auth();

  await fetchClient(
    `/disasters/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    },
    getToken
  );

  revalidatePath('/disastermanager/disasters', 'layout');

  return { success: true };
}
