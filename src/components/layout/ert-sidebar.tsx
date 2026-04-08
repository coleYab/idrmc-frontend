'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconBell,
  IconChevronsDown,
  IconClipboardList,
  IconFirstAidKit,
  IconLayoutDashboard,
  IconLogout,
  IconMap,
  IconMapPin,
  IconShare3,
  IconShieldCheck,
  IconUsers,
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
    href: '/ert/dashboard',
    icon: IconLayoutDashboard
  },
  {
    title: 'Assignments',
    href: '/ert/dashboard/assignments',
    icon: IconClipboardList
  },
  {
    title: 'Team Status',
    href: '/ert/dashboard/team',
    icon: IconUsers
  },
  {
    title: 'Medical Resources',
    href: '/ert/dashboard/medical',
    icon: IconFirstAidKit
  },
  {
    title: 'Response Protocols',
    href: '/ert/dashboard/protocols',
    icon: IconShieldCheck
  },
  {
    title: 'Map View',
    href: '/ert/dashboard/map',
    icon: IconMap
  },
  {
    title: 'My Profile',
    href: '/dashboard/profile',
    icon: IconUserCircle
  }
];

export default function ErtSidebar() {
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
              <Link href='/ert/dashboard'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <IconShieldCheck className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>ERT</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    Emergency Response Team
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
