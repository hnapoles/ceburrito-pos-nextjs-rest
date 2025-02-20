'use client';

import { useState } from "react";
import Link from "next/link"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { toast } from "@/hooks/use-toast"


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

import { IProductPrices, ProductSellingPricesData, ZodSchemaProductSellingPrices } from '@/app/model/products-model'; 

import { DeleteProductById } from "@/app/action/server/products-actions";



//import { ConfirmDialog } from "@/app/nav/confirm-dialog";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Input
} from "@/components/ui/input"

import { revalidateAndRedirectUrl } from "@/lib/revalidate-path";

import { ZodSchemaProduct, ProductData } from "@/app/model/products-model";
import { Lookup } from "@/app/model/lookups-model";

const defaultValues: ProductSellingPricesData = {
    _id: "",
    orderType: "",
    productId: "",
    sellingPrice: 0.00,
    
}



export default function ProductPricesEditRow() {

  const form = useForm<ProductSellingPricesData>({
              resolver: zodResolver(ZodSchemaProductSellingPrices),
              defaultValues: defaultValues,
              mode: "onBlur",
          })
  
          const {
              //register,
              //handleSubmit,
              //setError,
              //clearErrors,
              //trigger, // For triggering validation onBlur
              //getValues,
              //setFocus,
              //watch,
              //setValue,
              //reset,
              formState: { 
                  //errors, 
                  isSubmitting },
          } = form;

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



  const editLink = `${pathname}/`

  return (
      
    <TableRow>
      
      <TableCell className="font-medium">
        
                      <FormField
                          control={form.control}
                          name="orderType"
                          render={({ field }) => (
                              <FormItem>
                                  {/*(<FormLabel>Product Name</FormLabel>*/}
                                  <Input
                                      type="text"
                                      placeholder=""
                                      {...field} />

                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      
        
       
        
        
    </TableCell>

         
      <TableCell className="font-medium"></TableCell>
      <TableCell>
        
          
       
      </TableCell>
      <TableCell className="md:table-cell">
        <FormField
                          control={form.control}
                          name="sellingPrice"
                          render={({ field }) => (
                              <FormItem>
                                  {/*(<FormLabel>Product Name</FormLabel>*/}
                                  <Input
                                      type="number"
                                      placeholder=""
                                      {...field} />

                                  <FormMessage />
                              </FormItem>
                          )}
                      />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        
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
              
               
            
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog Content */}
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete product <strong></strong> with _id <strong></strong>? 
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
            </Button>
            <Button variant="destructive" >
                Confirm
            </Button>
            </DialogFooter>
        </DialogContent>

        </Dialog>
      </TableCell>

     

    </TableRow>
   
  );
}

