//import { Metadata } from 'next';
//import Image from 'next/image';

import { Button } from '@/components/ui/button-rounded-sm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDateRangePicker } from '@/app/features/dashboard/date-range-picker';
import { MainNav } from '@/app/features/dashboard/main-nav';
import { Overview } from '@/app/features/dashboard/overview';
import { RecentSales } from '@/app/features/dashboard/recent-sales';
//import { Search } from '@/app/features/dashboard/search';
import TeamSwitcher from '@/app/features/dashboard/team-switcher';
//import { UserNav } from '@/app/features/dashboard/user-nav';

import { formatPeso } from '@/app/actions/client/peso';
import { PhilippinePesoSvg, UtinsilsSvg } from '@/app/styles/icons';
import Link from 'next/link';

/*
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.',
};
*/

export default function DashboardPage() {
  return (
    <>
      {/* ✅ Remove md:hidden to show Dashboard on all screens */}
      <div className="flex flex-col w-full min-h-screen">
        {/* Top Navigation Bar */}
        <div className="border-b bg-white shadow-sm">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-2 md:mx-6 hidden sm:flex" />
            <div className="ml-auto flex items-center space-x-4">
              {/* Search & UserNav can be added here */}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Title & Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="overflow-x-auto sm:overflow-hidden whitespace-nowrap">
              <TabsList className="flex w-max space-x-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics" disabled>
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="reports" disabled>
                  Reports
                </TabsTrigger>
                <TabsTrigger value="notifications" disabled>
                  Notifications
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-4">
              {/* Responsive Grid Layout */}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Sales Today
                    </CardTitle>
                    <PhilippinePesoSvg />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg md:text-2xl font-bold">
                      {formatPeso(4545.5)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>

                <Link href="/orders?status=open" className="block">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Open Orders
                      </CardTitle>
                      <UtinsilsSvg />
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg md:text-2xl font-bold">+3</div>
                      <p className="text-xs text-muted-foreground">
                        +180.1% from last hour
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg md:text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg md:text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts & Recent Sales */}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7 lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-7 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
