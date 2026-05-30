import { NextRequest, NextResponse } from 'next/server';
import { currentUser, auth, createClerkClient } from '@clerk/nextjs/server';
import {
  CreateClerkUserSchema,
  mapClerkUser
} from '@/features/admin/types/clerk-user';

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

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminUser = await currentUser();
  const adminRoles = parseRoles(adminUser?.publicMetadata?.roles);
  if (!adminRoles.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || undefined;
  const limit = Math.min(Number(searchParams.get('limit')) || 100, 200);
  const offset = Number(searchParams.get('offset')) || 0;

  try {
    const clerkResponse = await clerk.users.getUserList({
      query,
      limit,
      offset
    });

    const users = clerkResponse.data.map((u) =>
      mapClerkUser({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        emailAddress: u.emailAddresses?.[0]?.emailAddress ?? '',
        imageUrl: u.imageUrl,
        roles: parseRoles(u.publicMetadata?.roles),
        banned: u.banned,
        createdAt: u.createdAt,
        lastSignInAt: u.lastSignInAt
      })
    );

    return NextResponse.json({
      data: users,
      totalCount: clerkResponse.totalCount
    });
  } catch (error) {
    console.error('Failed to fetch Clerk users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = CreateClerkUserSchema.parse(body);

    const clerkUser = await clerk.users.createUser({
      emailAddress: [parsed.emailAddress],
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      password: parsed.password ?? undefined,
      publicMetadata: { roles: parsed.roles }
    });

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

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const clerkErr = error as { errors: Array<{ message: string }> };
      return NextResponse.json(
        { error: clerkErr.errors.map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }
    console.error('Failed to create Clerk user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
