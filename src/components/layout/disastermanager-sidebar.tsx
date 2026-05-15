'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconAlertTriangle,
  IconBell,
  IconChartBar,
  IconChevronsDown,
  IconClipboardCheck,
  IconFileSearch,
  IconLayoutDashboard,
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
    href: '/disastermanager/dashboard',
    icon: IconLayoutDashboard
  },
  {
    title: 'Active Disasters',
    href: '/disastermanager/disasters/active',
    icon: IconProgressCheck
  },
  {
    title: 'Broadcasted Alerts',
    href: '/disastermanager/alerts',
    icon: IconAlertTriangle
  },
  {
    title: 'Resolved Disasters',
    href: '/disastermanager/disasters/resolved',
    icon: IconChartBar
  },
  {
    title: 'Map Overview',
    href: '/disastermanager/disasters/map-overview',
    icon: IconMapSearch
  },
  {
    title: 'Disaster Reports',
    href: '/disastermanager/reports',
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
    title: 'Sample Disaster Details',
    href: '/disastermanager/disasters/1/details',
    icon: IconMapPin
  },
  {
    title: 'Sample Response Coordination',
    href: '/disastermanager/disasters/1/response',
    icon: IconClipboardCheck
  }
];

export default function DisasterManagerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/disastermanager/dashboard'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <IconLayoutDashboard className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>IDRMC</span>
                  <span className='truncate text-xs'>Disaster Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
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
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarMenu>
            {quickActions.map((action) => (
              <SidebarMenuItem key={action.href}>
                <SidebarMenuButton asChild tooltip={action.title} size='sm'>
                  <Link href={action.href}>
                    <action.icon />
                    <span>{action.title}</span>
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
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className='truncate text-xs'>
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    {user && (
                      <UserAvatarProfile
                        className='h-8 w-8 rounded-lg'
                        showInfo
                        user={user}
                      />
                    )}
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className='truncate text-xs'>
                        {user?.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/disastermanager/profile')}
                  >
                    <IconUserCircle />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push('/disastermanager/notifications')
                    }
                  >
                    <IconBell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <SignOutButton>
                  <DropdownMenuItem>
                    <IconLogout />
                    Log out
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
