//import { GetLookups } from '@/app/actions/server/lookups-actions';

import Link from 'next/link';

import {
  Card,
  CardContent,
  CardFooter,
  //CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreditCard, Handshake, ShoppingCart } from 'lucide-react';

export default async function OrdersCreatePage() {
  //const types = await GetLookups('order', 'type');

  return (
    <div className="container mx-auto lg:p-4 md:p-2 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
        <Link href={`/orders/create/pos`}>
          <Card className="text-center flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle className="text-sm font-medium">POS</CardTitle>
            </CardHeader>

            <CardContent className="text-green-500">
              <ShoppingCart className="w-12 h-12" />
            </CardContent>
            <CardContent>Point Of Sale</CardContent>
            <CardFooter></CardFooter>
          </Card>
        </Link>

        <Link href={`/orders/create/btb`}>
          <Card className="text-center flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle className="text-sm font-medium">BTB</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-500">
              <Handshake className="w-12 h-12" />
            </CardContent>
            <CardContent>Business To Business</CardContent>
            <CardFooter></CardFooter>
          </Card>
        </Link>
        <Link href={`/orders/create/btc`}>
          <Card className="text-center flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle className="text-sm font-medium">BTC</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-500">
              <CreditCard className="w-12 h-12" />
            </CardContent>
            <CardContent>Business To Consumer</CardContent>
            <CardFooter></CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
