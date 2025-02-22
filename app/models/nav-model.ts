import { LucideIcon } from "lucide-react";

import {
    Home,
    LineChart,
    Package,
    //Package2,
    //PanelLeft,
    //Settings,
    ShoppingCart,
    Users2
  } from 'lucide-react';


export interface NavItems {
    title: string,
    href: string,
    iconName: LucideIcon
}
  
export interface NavItemsProps {
    navItems: NavItems[]
}
  

export const listNavItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        iconName: Home
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      iconName: ShoppingCart
    },
    {
      title: "Products",
      href: "/dashboard/products",
      iconName: Package
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      iconName: Users2
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      iconName: LineChart
    }
]