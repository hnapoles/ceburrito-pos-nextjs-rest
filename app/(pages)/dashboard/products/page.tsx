import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  
  export default function ProductsPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>View products.</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    );
  }