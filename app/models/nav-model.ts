import { CreditCard, Handshake, LucideIcon } from 'lucide-react';

import {
  Home,
  //LineChart,
  //Package,
  //Package2,
  //PanelLeft,
  //Settings,
  ShoppingCart,
  Users2,
  //PhilippinePeso,
  //Utensils,
  Building,
  //Shapes,
  ListOrdered,
  Beef,
  ChartLine,
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
    iconName: ListOrdered,
  },
  {
    title: 'Products',
    href: '/products',
    iconName: Beef,
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
    iconName: ChartLine,
  },
  {
    title: 'POS',
    href: '/orders/create/pos',
    iconName: ShoppingCart,
  },
  {
    title: 'BTB',
    href: '/orders/create/btb',
    iconName: Handshake,
  },
  {
    title: 'BTC',
    href: '/orders/create/btc',
    iconName: CreditCard,
  },
];
