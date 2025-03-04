'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react'; // Icon for the spinner
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
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

import { ProductSellingPriceBase } from '@/app/models/products-model';

import { DeleteProductSellingPriceById } from '@/app/actions/server/product-selling-prices-actions';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';

export default function ProductsByIdPricesTableRow({
  productPrice,
  productName,
  productId,
}: {
  productPrice: ProductSellingPriceBase;
  productName: string | '';
  productId: string | '';
}) {
  const router = useRouter();
  const pathname = usePathname();

  console.log(productName);

  //const [toggleEditDialog, setToggleEditDialog] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: '',
    description: '',
    productId: '',
  });

  const [isOpenLoader, setIsOpenLoader] = useState(false);

  const handleOpenDialog = (productPriceId: string) => {
    setDialogData({
      title: 'Delete Product',
      description: `Are you sure you want to delete product prices ID ${productPriceId}? This action cannot be undone.`,
      productId: productPriceId,
    });
    setDialogOpen(true);
    // Ensure the dropdown closes before opening the dialog
    //setTimeout(() => setDialogOpen(true), 100);
  };

  const handleEditClick = () => {
    /*
    console.log('current value of toggled ', toggleEditDialog);
    setToggleEditDialog((prev) => !prev); // Use functional state update
    console.log('new value of toggled ', toggleEditDialog);
    */
    router.push(`/products/${productId}/prices/${productPrice._id}`);
  };

  /*
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = async () => {
    setIsLoading(true);
    await revalidateAndRedirectUrl(url);
    setIsLoading(false);
  };
  */

  const handleConfirmDelete = async (id: string) => {
    console.log('Deleting product:', dialogData.productId);
    setDialogOpen(false);
    await DeleteProductSellingPriceById(id);
    setIsOpenLoader(true); // Open loader dialog
    await revalidateAndRedirectUrl(pathname);
    setTimeout(() => {
      setIsOpenLoader(false); // Close after completion
    }, 300);
  };

  //const editLink = `${pathname}/${productPrice._id}`;

  return (
    <>
      {/* Loading Dialog */}
      <Dialog open={isOpenLoader} onOpenChange={setIsOpenLoader}>
        <DialogContent className="flex flex-col items-center gap-4 p-6">
          <DialogTitle>Processing, please wait...</DialogTitle>
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </DialogContent>
      </Dialog>

      <TableRow>
        <TableCell className="font-medium">{productPrice.orderType}</TableCell>
        <TableCell className="font-medium">{productPrice.storeName}</TableCell>
        <TableCell className="font-medium">{productPrice.size}</TableCell>
        <TableCell className="font-medium">
          {productPrice.customerName}
        </TableCell>
        <TableCell className="font-medium">
          {' '}
          {productPrice.sellingPrice?.toFixed(2)}{' '}
        </TableCell>

        <TableCell className="hidden">{productPrice.updatedBy}</TableCell>
        <TableCell className="hidden">{productPrice.updatedAt}</TableCell>
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
              <DropdownMenuItem onClick={handleEditClick}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => handleOpenDialog(productPrice._id || '')}
                >
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Price</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete product price{' '}
                  <strong>{productPrice.orderType}</strong> with _id{' '}
                  <strong>{productPrice._id}</strong>?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleConfirmDelete(productPrice._id || '')}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TableCell>
      </TableRow>
    </>
  );
}
