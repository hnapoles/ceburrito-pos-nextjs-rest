import { LucideIcon } from 'lucide-react';

import {
  Home,
  //LineChart,
  //Package,
  //Package2,
  //PanelLeft,
  //Settings,
  //ShoppingCart,
  Users2,
  PhilippinePeso,
  Utensils,
  Building,
  Shapes,
} from 'lucide-react';

export interface NavItems {
  title: string;
  href: string;
  iconName: LucideIcon;
}

export interface NavItemsProps {
  navItems: NavItems[];
}

export const listNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    iconName: Home,
  },
  {
    title: 'Orders',
    href: '/orders',
    iconName: Utensils,
  },
  {
    title: 'Products',
    href: '/products',
    iconName: Shapes,
  },
  {
    title: 'Stores',
    href: '/stores',
    iconName: Building,
  },
  {
    title: 'Customers',
    href: '/customers',
    iconName: Users2,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    iconName: PhilippinePeso,
  },
];
