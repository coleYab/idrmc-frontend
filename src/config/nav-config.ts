import { NavItem } from '@/types';

/**
 * Navigation configuration with RBAC support
 *
 * This configuration is used for both the sidebar navigation and Cmd+K bar.
 *
 * RBAC Access Control:
 * Each navigation item can have an `access` property that controls visibility
 * based on permissions, plans, features, roles, and organization context.
 *
 * Examples:
 *
 * 1. Require specific permission:
 *    access: { permission: 'admin:dashboard:view' }
 *
 * 2. Require specific plan:
 *    access: { plan: 'pro' }
 *
 * 3. Require specific feature:
 *    access: { feature: 'advanced_analytics' }
 *
 * 4. Require specific role:
 *    access: { role: 'incident validator' }
 *
 * 5. Multiple conditions (all must be true):
 *    access: { permission: 'admin:users:manage', plan: 'pro' }
 *
 * Note: The `visible` function is deprecated but still supported for backward compatibility.
 * Use the `access` property for new items.
 */
export const navItems: NavItem[] = [
  {
    title: 'Overview',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Incident Management',
    url: '/dashboard/incidents',
    icon: 'incidents',
    shortcut: ['i', 'i'],
    isActive: false,
    items: [],
    // access: { role: 'incident validator' } // Needs confirmation of Clerk role strings
  },
  {
    title: 'Emergency Alerts',
    url: '/dashboard/alerts',
    icon: 'alerts',
    shortcut: ['a', 'a'],
    isActive: false,
    items: [],
    // access: { role: 'incident validator' }
  },
  {
    title: 'Disaster Declarations',
    url: '/dashboard/disasters',
    icon: 'disasters',
    shortcut: ['d', 'e'],
    isActive: false,
    items: [],
    // access: { role: 'disaster manager' }
  },
  {
    title: 'Logistics & Resources',
    url: '/dashboard/resources',
    icon: 'product', // We'll keep 'product' mapped to 'IconBox' or 'IconBox' logic
    shortcut: ['r', 'r'],
    isActive: false,
    items: [],
    // access: { role: 'emergency response team' }
  },
  {
    title: 'Donation Campaigns',
    url: '/dashboard/donations',
    icon: 'donations',
    shortcut: ['f', 'f'],
    isActive: false,
    items: [],
    // access: { role: 'disaster manager' }
  },
  {
    title: 'Administration',
    url: '/dashboard/admin',
    icon: 'admin',
    shortcut: ['s', 's'],
    isActive: false,
    items: [],
    // access: { role: 'administrator' }
  },
  /* --- REFERENCE / STARTER TEMPLATE CODE --- */
  // {
  //   title: 'Product',
  //   url: '/dashboard/product',
  //   icon: 'product',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: []
  // },
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: []
  // },
  // {
  //   title: 'Chat',
  //   url: '/dashboard/chat',
  //   icon: 'chat',
  //   shortcut: ['c', 'c'],
  //   isActive: false,
  //   items: []
  // },
  // {
  //   title: 'Account',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'account',
  //   isActive: true,
  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'profile',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Notifications',
  //       url: '/dashboard/notifications',
  //       icon: 'notification',
  //       shortcut: ['n', 'n']
  //     },
  //     {
  //       title: 'Login',
  //       shortcut: ['l', 'l'],
  //       url: '/',
  //       icon: 'login'
  //     }
  //   ]
  // }
];
