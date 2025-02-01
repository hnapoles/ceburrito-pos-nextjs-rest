import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  
  export default function DashboardPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>View dashboard.</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    );
  }