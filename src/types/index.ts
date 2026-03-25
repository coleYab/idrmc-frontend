import { Icons } from '@/components/icons';

export const USER_ROLES = [
  'incident validator',
  'disaster manager',
  'resource manager',
  'emergency response teams'
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface PermissionCheck {
  permission?: string;
  plan?: string;
  feature?: string;
  role?: UserRole;
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  access?: PermissionCheck;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
