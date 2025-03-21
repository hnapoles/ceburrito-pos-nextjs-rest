'use client';

import { useState } from 'react';
import Link from 'next/link';

import { usePathname, useRouter } from 'next/navigation';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button-rounded-sm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
//import { Dialog } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';

import { ProductBase } from '@/app/models/products-model';

import { DeleteProductById } from '@/app/actions/server/products-actions';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';

//import { ConfirmDialog } from "@/app/nav/confirm-dialog";

export default function ProductsTableRow({
  product,
}: {
  product: ProductBase;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: '',
    description: '',
    productId: '',
  });

  const handleOpenDialog = (productId: string) => {
    // Close the dropdown before opening the dialog
    setIsDropdownOpen(false);

    setDialogData({
      title: 'Delete Product',
      description: `Are you sure you want to delete product ID ${productId}? This action cannot be undone.`,
      productId: productId,
    });
    setDialogOpen(true);
    // Ensure the dropdown closes before opening the dialog
    //setTimeout(() => setDialogOpen(true), 100);
  };

  const handleConfirmDelete = async (id: string) => {
    console.log('Deleting product:', dialogData.productId);
    setDialogOpen(false);
    await DeleteProductById(id);
    revalidateAndRedirectUrl(pathname);
  };

  const viewLink = `${pathname}/${product._id}/view`;

  return (
    <TableRow
      className="hover:pointer-cursor"
      onClick={() => router.push(viewLink)}
    >
      <TableCell className="table-cell">
        {product.imageUrl ? (
          <Image
            alt="User image"
            className="aspect-square rounded-md object-cover"
            height="64"
            src={product.imageUrl}
            width="64"
          />
        ) : null}
      </TableCell>
      <TableCell className="font-medium">
        {product.name} <Badge variant="outline">{product.status}</Badge>{' '}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge variant="outline">{product.category}</Badge>
        {product.description}
      </TableCell>
      <TableCell className="hidden md:table-cell">{product._id}</TableCell>
      <TableCell className="hidden md:table-cell">
        {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : ''}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {product.updatedBy}
      </TableCell>
      <TableCell>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={viewLink}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className={product.status === 'archived' ? 'block' : 'hidden'}
            >
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevents navigation
                  e.stopPropagation(); // Stops Card click
                  handleOpenDialog(product?._id || '');
                }}
              >
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete product{' '}
                <strong>{product.name}</strong> with _id{' '}
                <strong>{product._id}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault(); // Prevents navigation
                  e.stopPropagation(); // Stops Card click
                  setDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault(); // Prevents navigation
                  e.stopPropagation(); // Stops Card click
                  handleConfirmDelete(product._id || '');
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
