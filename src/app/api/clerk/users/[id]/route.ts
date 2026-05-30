import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { mapClerkUser } from '@/features/admin/types/clerk-user';

const VALID_ROLES = [
  'admin',
  'incident_validator',
  'disaster_response_team',
  'emergency_response_team',
  'user'
];

function normalizeRole(value: string): string {
  return value.trim().toLowerCase();
}

function parseRoles(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const roles: string[] = [];
  for (const r of raw) {
    if (typeof r === 'string') {
      const normal = normalizeRole(r);
      if (normal && VALID_ROLES.includes(normal)) {
        roles.push(normal);
      }
    }
  }
  return roles;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(id);

    const user = mapClerkUser({
      id: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      emailAddress: clerkUser.emailAddresses?.[0]?.emailAddress ?? '',
      imageUrl: clerkUser.imageUrl,
      roles: parseRoles(clerkUser.publicMetadata?.roles),
      banned: clerkUser.banned,
      createdAt: clerkUser.createdAt,
      lastSignInAt: clerkUser.lastSignInAt
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Failed to fetch Clerk user:', error);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { roles, firstName, lastName } = body;

    if (!roles && !firstName && !lastName) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {};
    if (roles) {
      updatePayload.publicMetadata = { roles };
    }
    if (firstName) updatePayload.firstName = firstName;
    if (lastName) updatePayload.lastName = lastName;

    const clerk = await clerkClient();
    const clerkUser = await clerk.users.updateUser(id, updatePayload);

    const user = mapClerkUser({
      id: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      emailAddress: clerkUser.emailAddresses?.[0]?.emailAddress ?? '',
      imageUrl: clerkUser.imageUrl,
      roles: parseRoles(clerkUser.publicMetadata?.roles),
      banned: clerkUser.banned,
      createdAt: clerkUser.createdAt,
      lastSignInAt: clerkUser.lastSignInAt
    });

    return NextResponse.json({ data: user });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const clerkErr = error as { errors: Array<{ message: string }> };
      return NextResponse.json(
        { error: clerkErr.errors.map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }
    console.error('Failed to update Clerk user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (id === userId) {
    return NextResponse.json(
      { error: 'Cannot delete your own account' },
      { status: 400 }
    );
  }

  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete Clerk user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
