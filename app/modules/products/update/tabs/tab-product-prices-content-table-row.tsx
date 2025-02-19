'use client';

import { useState } from "react";
import Link from "next/link"

import { usePathname } from 'next/navigation';

//import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
//import { Dialog } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';

import { IProductPrices } from '@/app/model/products-model'; 

import { DeleteProductById } from "@/app/action/server/products-actions";

import { revalidateAndRedirectUrl } from "@/lib/revalidate-path";

//import { ConfirmDialog } from "@/app/nav/confirm-dialog";

export default function ProductPricesContentTableRow({ productPrices }: { productPrices: IProductPrices}) {

  const pathname = usePathname();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", description: "", productId: "" });

  const handleOpenDialog = (productId: string) => {
    setDialogData({
      title: "Delete Product",
      description: `Are you sure you want to delete product ID ${productId}? This action cannot be undone.`,
      productId: productId,
    });
    setDialogOpen(true);
    // Ensure the dropdown closes before opening the dialog
    //setTimeout(() => setDialogOpen(true), 100);
  };

  const handleConfirmDelete = async (id: string) => {
    console.log("Deleting product:", dialogData.productId);
    setDialogOpen(false);
    await DeleteProductById(id);
    revalidateAndRedirectUrl(pathname);
  };

  const editLink = `${pathname}/${productPrices._id}`

  return (
    <TableRow>
      
      <TableCell className="font-medium">{productPrices.storeDetails?.name}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {productPrices.customerDetails?.name}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{productPrices.sellingPrice}</TableCell>
      <TableCell className="hidden md:table-cell">
        {productPrices.createdAt?.toLocaleString('en-US', { timeZone: 'America/Chicago' })}
      </TableCell>
      <TableCell>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <Link href={editLink}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              
                <button  onClick={()=> handleOpenDialog(productPrices._id)} >Delete</button>
                
            
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog Content */}
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete product <strong>{productPrices._id}</strong> with _id <strong>{productPrices._id}</strong>? 
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleConfirmDelete(productPrices._id)}>
                Confirm
            </Button>
            </DialogFooter>
        </DialogContent>

        </Dialog>
      </TableCell>
    </TableRow>
  );
}

