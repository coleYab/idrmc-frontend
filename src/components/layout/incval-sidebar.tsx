'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconBell,
  IconChartBar,
  IconChevronsDown,
  IconClipboardCheck,
  IconFileSearch,
  IconLayoutDashboard,
  IconList,
  IconLogout,
  IconMapPin,
  IconMapSearch,
  IconProgressCheck,
  IconReportAnalytics,
  IconShare3,
  IconUserCircle
} from '@tabler/icons-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { SignOutButton, useUser } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '../user-avatar-profile';

const primaryRoutes = [
  {
    title: 'Dashboard',
    href: '/incval/dashboard',
    icon: IconLayoutDashboard
  },
  {
    title: 'Incident Management',
    href: '/incval/incidents',
    icon: IconList
  },
  {
    title: 'Pending Incidents',
    href: '/incval/incidents/pending',
    icon: IconClipboardCheck
  },
  {
    title: 'Active Incidents',
    href: '/incval/incidents/active',
    icon: IconProgressCheck
  },
  {
    title: 'Resolved Incidents',
    href: '/incval/incidents/resolved',
    icon: IconChartBar
  },
  {
    title: 'Map Explorer',
    href: '/incval/incidents/map-explorer',
    icon: IconMapSearch
  },
  {
    title: 'Incident Search',
    href: '/incval/incidents/search',
    icon: IconFileSearch
  },
  {
    title: 'Incident Summary',
    href: '/incval/reports/incident-summary',
    icon: IconReportAnalytics
  },
  {
    title: 'My Profile',
    href: '/dashboard/profile',
    icon: IconUserCircle
  }
];

const quickActions = [
  {
    title: 'Sample Details',
    href: '/incval/incidents/1/details',
    icon: IconMapPin
  },
  {
    title: 'Sample Verify',
    href: '/incval/incidents/1/verify',
    icon: IconClipboardCheck
  },
  {
    title: 'Sample Update Status',
    href: '/incval/incidents/1/update-status',
    icon: IconProgressCheck
  },
  {
    title: 'Sample Map Context',
    href: '/incval/incidents/sample-001/map-context',
    icon: IconMapSearch
  }
];

export default function IncvalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const handleShareProfileAccess = async () => {
    const profileUrl = `${window.location.origin}/dashboard/profile`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Profile Management',
          text: 'Use this link to access profile management.',
          url: profileUrl
        });
        return;
      }

      await navigator.clipboard.writeText(profileUrl);
      window.alert('Profile management link copied to clipboard.');
    } catch {
      window.alert(`Share this profile link: ${profileUrl}`);
    }
  };

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size='lg'>
              <Link href='/incval/dashboard'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <IconLayoutDashboard className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>INCVAL</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    Incident Management
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Primary Routes</SidebarGroupLabel>
          <SidebarMenu>
            {primaryRoutes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === route.href}
                  tooltip={route.title}
                >
                  <Link href={route.href}>
                    <route.icon />
                    <span>{route.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Detailed Actions</SidebarGroupLabel>
          <SidebarMenu>
            {quickActions.map((route) => (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === route.href}
                  tooltip={route.title}
                >
                  <Link href={route.href}>
                    <route.icon />
                    <span>{route.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  {user && (
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                      user={user}
                    />
                  )}
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    {user && (
                      <UserAvatarProfile
                        className='h-8 w-8 rounded-lg'
                        showInfo
                        user={user}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareProfileAccess}>
                    <IconShare3 className='mr-2 h-4 w-4' />
                    Share Profile Access
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/notifications')}
                  >
                    <IconBell className='mr-2 h-4 w-4' />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconLogout className='mr-2 h-4 w-4' />
                  <SignOutButton redirectUrl='/auth/sign-in' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
