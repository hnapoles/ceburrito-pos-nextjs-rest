'use client';

import { useState } from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

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

import { ProductSellingPricesData } from '@/app/model/products-model';

import { DeleteProductById } from '@/app/action/server/products-actions';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';

//import { ConfirmDialog } from "@/app/nav/confirm-dialog";
import { useDialogStore } from '@/app/provider/zustand-provider';
import TabProductPricesDialogUpdate from './tab-product-prices-content-dialog-update';
import { useGlobalStore } from '@/app/provider/zustand-provider';

import { GetProductSellingPricesByOwnId } from '@/app/action/server/product-selling-prices-actions';

export default function ProductPricesContentTableRow({
  productPrices,
  setRefresh,
  setDialogId,
}: {
  productPrices: ProductSellingPricesData;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { openUpdateDialog, setUpdateDialogId } = useDialogStore();

  const pathname = usePathname();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: '',
    description: '',
    productId: '',
  });

  const handleOpenDialog = (productId: string) => {
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

  //const editLink = `${pathname}/${productPrices?._id || ''}`;

  const setProductSellingPrices = useGlobalStore(
    (state) => state.setProductSellingPrices,
  );

  const handleEditClick = async () => {
    //setUpdateDialogId(productPrices?._id || '');
    if (productPrices && productPrices._id) {
      setDialogId(productPrices._id);
      const prices = await GetProductSellingPricesByOwnId(productPrices._id);

      /*
      const setProductSellingPrices = useGlobalStore(
        (state) => state.setProductSellingPrices,
      );
      */

      if (productPrices) {
        setProductSellingPrices(productPrices);
      }

      openUpdateDialog();
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {productPrices?.orderType || 'n/a'}
      </TableCell>
      <TableCell className="font-medium">
        {productPrices?.storeName || 'n/a'}
      </TableCell>
      <TableCell>{productPrices.customerName || 'n/a'}</TableCell>
      <TableCell className="hidden md:table-cell">
        {productPrices.sellingPrice?.toFixed(2)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {productPrices.createdAt?.toLocaleString('en-US', {
          timeZone: 'America/Chicago',
        })}
      </TableCell>
      <TableCell>
        <Dialog>
          {/* Dropdown Menu Inside the Dialog */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {/*}
              <Link href={editLink}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
              */}
              <Link
                href="#"
                passHref
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  handleEditClick();
                }}
              >
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>

              <DropdownMenuItem>
                <button
                  onClick={() => handleOpenDialog(productPrices._id || '')}
                >
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog Content */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete product{' '}
                <strong>{productPrices._id}</strong> with _id{' '}
                <strong>{productPrices._id}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleConfirmDelete(productPrices._id || '')}
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
