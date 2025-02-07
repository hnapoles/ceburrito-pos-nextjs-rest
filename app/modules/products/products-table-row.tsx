import { revalidatePath } from 'next/cache';
import Link from "next/link"

import { usePathname } from 'next/navigation';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';


import { IProduct } from '@/app/model/products-model'; 


export default async function ProductsTableRow({ product }: { product: IProduct}) {

  const pathname = usePathname();

  
  async function deleteUserAction(id:string) {
    
    if (id) {
        //await deleteUserByIdService(id);
        revalidatePath('/settings/products');
    }
    
  }

  const editLink = `${pathname}/${product.id}`

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        {product.imageUrl ? <Image
          alt="User image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={product.imageUrl}
          width="64" /> : null
        }
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {product.description}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{product.imageUrl}</TableCell>
      <TableCell className="hidden md:table-cell">
        {product.createdAt?.toLocaleString('en-US', { timeZone: 'America/Chicago' })}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={editLink}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <form>
                <button type="submit" onClick={()=> deleteUserAction(product.id)} >Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
