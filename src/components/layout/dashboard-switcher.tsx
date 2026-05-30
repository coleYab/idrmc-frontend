'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconAlertTriangle,
  IconCertificate,
  IconFirstAidKit,
  IconShield
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

const DASHBOARDS = [
  {
    label: 'Admin Console',
    href: '/admin/dashboard',
    icon: IconShield
  },
  {
    label: 'Incident Validator',
    href: '/incval/dashboard',
    icon: IconCertificate
  },
  {
    label: 'Disaster Manager',
    href: '/disastermanager/dashboard',
    icon: IconAlertTriangle
  },
  {
    label: 'Emergency Response',
    href: '/ert/dashboard',
    icon: IconFirstAidKit
  }
];

function getActiveRoot(pathname: string) {
  return '/' + (pathname.split('/')[1] ?? '');
}

interface DashboardSwitcherProps {
  variant: 'sidebar' | 'header';
}

export default function DashboardSwitcher({ variant }: DashboardSwitcherProps) {
  const pathname = usePathname();
  const activeRoot = getActiveRoot(pathname);

  if (variant === 'sidebar') {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Switch Dashboard</SidebarGroupLabel>
        <SidebarMenu>
          {DASHBOARDS.map((d) => {
            const root = getActiveRoot(d.href);
            return (
              <SidebarMenuItem key={d.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(root)}
                  tooltip={d.label}
                >
                  <Link href={d.href}>
                    <d.icon />
                    <span>{d.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <div className='flex items-center gap-1'>
      {DASHBOARDS.map((d) => {
        const root = getActiveRoot(d.href);
        return (
          <Button
            key={d.href}
            variant={pathname.startsWith(root) ? 'default' : 'ghost'}
            size='sm'
            className='h-8 gap-1.5 px-2'
            asChild
          >
            <Link href={d.href}>
              <d.icon className='size-4' />
              <span className='hidden sm:inline'>{d.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
