import { revalidatePath } from 'next/cache';
import Link from "next/link"

import { useSearchParams, usePathname, useRouter  } from 'next/navigation';

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

import { deleteUserByIdService } from '@/app/modules/settings/users/services/users.service';
//import { deleteProduct } from '@/app/lib/actions/product-actions';

import { AppUser } from '@prisma/client';

export function UserTableRow({ user }: { user: AppUser}) {

  const pathname = usePathname();

  async function deleteUserAction(formData: FormData) {
    let id = formData.get('id');
    if (id) {
        await deleteUserByIdService('123');
        revalidatePath('/settings/users');
    }
    
  }

  const editLink = `${pathname}/${user.id}`

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        {user.imageUrl ? <Image
          alt="User image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={user.imageUrl}
          width="64" /> : null
        }
      </TableCell>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {user.email}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{user.primaryRole}</TableCell>
      <TableCell className="hidden md:table-cell">{user.emailVerified?.toString()}</TableCell>
      <TableCell className="hidden md:table-cell">
        {user.createdAt?.toLocaleString('en-US', { timeZone: 'America/Chicago' })}
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
              <form action={deleteUserAction}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
