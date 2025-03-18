import {
  //CreditCard, Handshake,
  LucideIcon,
} from 'lucide-react';

import {
  Home,
  //LineChart,
  //Package,
  //Package2,
  //PanelLeft,
  Settings,
  ShoppingCart,
  //Users2,
  //PhilippinePeso,
  //Utensils,
  //Building,
  //Shapes,
  ListOrdered,
  Beef,
  ReceiptCent,
  FileUser,
  //ChartLine,
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
    title: 'POS',
    href: '/orders/create/pos',
    iconName: ShoppingCart,
  },
  /*
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
  */
];

export interface AppItems {
  title: string;
  href: string;
  iconName: LucideIcon;
}

export interface AppItemsProps {
  navItems: AppItems[];
}

export const listAppItems = [
  {
    title: 'Finance App',
    href: 'https://fin.ceburrito.ph',
    iconName: ReceiptCent,
  },
  {
    title: 'HR App',
    href: 'https://hrs.ceburrito.ph',
    iconName: FileUser,
  },
  {
    title: 'Admin App',
    href: 'https://app.ceburrito.ph',
    iconName: Settings,
  },
];
