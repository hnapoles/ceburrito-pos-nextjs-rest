import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';

  import { apiDq } from '@/lib/axios-client';

  import {IDqFindResponse} from '@/app/modules/settings/users/services/users.service'
  
  export default async function ProductsPage() {


    try {
      const products = await apiDq<IDqFindResponse>({operation: 'Find', data: { entity: "product"} })
      console.log(products)
    } catch(err) {
      console.log(err)
    }


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