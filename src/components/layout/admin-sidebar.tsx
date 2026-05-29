'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconActivity,
  IconChevronsDown,
  IconLayoutDashboard,
  IconLogout,
  IconShield,
  IconUserCircle,
  IconUsers
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
    href: '/admin/dashboard',
    icon: IconLayoutDashboard
  },
  {
    title: 'Users Management',
    href: '/admin/users',
    icon: IconUsers
  },
  {
    title: 'Activity Log',
    href: '/admin/activity',
    icon: IconActivity
  },
  {
    title: 'My Profile',
    href: '/admin/profile',
    icon: IconUserCircle
  }
];

const quickActions: { title: string; href: string; icon: any }[] = [];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/admin/dashboard'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <IconShield className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Admin</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    System Console
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

        {/* {pathname !== '/admin/dashboard' && (
          // <SidebarGroup>
          //   <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          //   <SidebarMenu>
          //     {quickActions.map((action) => (
          //       <SidebarMenuItem key={action.href}>
          //         <SidebarMenuButton asChild tooltip={action.title} size='sm'>
          //           <Link href={action.href}>
          //             <action.icon />
          //             <span>{action.title}</span>
          //           </Link>
          //         </SidebarMenuButton>
          //       </SidebarMenuItem>
          //     ))}
          //   </SidebarMenu>
          // </SidebarGroup>
        )} */}
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
                  <UserAvatarProfile user={user ?? null} />
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className='text-muted-foreground truncate text-xs'>
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </span>
                  </div>
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-56'
                align='end'
                sideOffset={10}
                forceMount
              >
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className='text-muted-foreground text-xs leading-none'>
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href='/admin/profile'>
                      <IconUserCircle className='size-4' />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <SignOutButton>
                    <IconLogout className='size-4' />
                    <span>Sign Out</span>
                  </SignOutButton>
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
