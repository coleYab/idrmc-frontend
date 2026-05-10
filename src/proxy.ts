import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { normalizeRole } from '@/lib/utils';

const isPublicRoute = createRouteMatcher([
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/',
  '/about',
  '/privacy-policy',
  '/terms-of-service'
]);

const routeAccessMap: Record<string, string[]> = {
  admin: ['/incval', '/ert', '/disastermanager', '/dashboard'],
  incident_validator: ['/incval', '/dashboard/incidents', '/dashboard/incval'],
  disaster_response_team: [
    '/disastermanager',
    '/dashboard/disasters',
    '/dashboard/locations'
  ],
  emergency_response_team: ['/ert', '/dashboard/incidents', '/dashboard/ert'],
  user: ['/dashboard/profile']
};

const protectedPrefixes = Array.from(
  new Set(Object.values(routeAccessMap).flat())
);

function canAccessPath(role: string, pathname: string) {
  const allowedPrefixes = routeAccessMap[role];

  if (!allowedPrefixes) {
    return false;
  }

  return allowedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function getDefaultDashboardPath(role: string) {
  const allowedPrefixes = routeAccessMap[role];

  if (!allowedPrefixes || allowedPrefixes.length === 0) {
    return '/auth/sign-in';
  }

  return allowedPrefixes[0];
}

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) {
    return;
  }

  const { userId } = await auth();
  if (!userId) {
    await auth.protect();
    return;
  }

  const user = await (await clerkClient()).users.getUser(userId);
  const role =
    normalizeRole(user.publicMetadata?.role) ||
    normalizeRole(user.unsafeMetadata?.role);
  const { pathname } = request.nextUrl;

  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    if (!canAccessPath(role, pathname)) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardPath(role), request.url)
      );
    }
  }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
