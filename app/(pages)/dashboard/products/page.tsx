import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';

  import { apiDq } from '@/lib/axios-client-v2';

  import {IDqFindResponse} from '@/app/modules/settings/users/services/users.service'

  import ErrorDisplay  from './error-display'

  export interface Product {
    id: string
    name: string
    description: string
    price?: number
  }
  
  export default async function ProductsPage() {


  
      const {data: products, error} = await apiDq<Product[]>({operation: 'Find', data: { entity: "product"}, params: {keyword: "phone"} })
     
      if (error) {
        return <ErrorDisplay message={error} />
      }
    
      if (!products || products.length === 0) {
        return <div>No products available.</div>
      }


    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>View products.</CardDescription>
          {JSON.stringify(products)}
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    );
  }