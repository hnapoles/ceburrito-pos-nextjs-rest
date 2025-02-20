'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';

  import ProductPricesContentTableRow from './tab-product-prices-content-table-row';
  import { useRouter, usePathname } from 'next/navigation';
  import { ChevronLeft, ChevronRight } from 'lucide-react';
  import { Button } from '@/components/ui/button';

import { PlusCircle } from 'lucide-react';

import { IProductPrices } from '@/app/model/products-model';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useDialogStore } from '@/app/provider/zustand-provider';
import { open } from 'node:inspector/promises';



export default function TabProductPricesContentTableSimple({
    data,
    limit,
    page,
    totalDataCount,
  }: {
    data: IProductPrices[];
    limit: number;
    page: number;
    totalDataCount: number;
  }) {

    

    const { isCreateDialogOpen, closeCreateDialog, openCreateDialog, toggleCreateDialog } = useDialogStore();

    const router = useRouter();
    const pathname = usePathname();
    const rowsPerPage = 10;
  
    function prevPage() {
      router.back();
    }
  
    function nextPage() {
      //router.push(`/?offset=${offset}`, { scroll: false });
      router.push(`${pathname}?page=${page+1}&limit=${limit}`, { scroll: false });
    }

    return (
      <div>
         
      <Card>
        <CardHeader>
          <CardTitle>
            Product Prices {" "}
            <Button size="sm" className="h-6 gap-1 px-2" onClick={() => {
                          openCreateDialog()
                        }}>
                        <PlusCircle className="h-3.5 w-3.5" 
                        />
            </Button>
          </CardTitle>
          <CardDescription>
            Manage product prices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Type</TableHead>
                <TableHead>Store Name</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead className="hidden md:table-cell">Selling Price</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            
            {data && data.length>0 &&
                <TableBody>
                
                {data.map((row) => (
                    <ProductPricesContentTableRow key={row._id} productPrices={row} />
                ))}
                 
                  
              </TableBody>
            }
            
          </Table>
        </CardContent>
        <CardFooter>
          <form className="flex items-center w-full justify-between">
            <div className="text-xs text-muted-foreground">
              Showing{' '}
              <strong>
                {Math.max(1, Math.min(limit - rowsPerPage, totalDataCount) + 1)}-{Math.min(limit, totalDataCount)}
              </strong>{' '}
              of <strong>{totalDataCount}</strong> products
            </div>
            <div className="flex">
              <Button
                formAction={prevPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={false}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <Button
                formAction={nextPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={limit > totalDataCount}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
     
     <Dialog open={isCreateDialogOpen} onOpenChange={toggleCreateDialog}>
     {/*<DialogTrigger asChild>
       <Button variant="outline">Edit Profile</Button>
     </DialogTrigger>
     */}
     <DialogContent className="sm:max-w-[425px]" >
       <DialogHeader>
         <DialogTitle>Edit profile</DialogTitle>
         <DialogDescription>
           Make changes to your profile here. Click save when you're done.
         </DialogDescription>
       </DialogHeader>
       <div className="grid gap-4 py-4">
         <div className="grid grid-cols-4 items-center gap-4">
           <Label htmlFor="name" className="text-right">
             Name
           </Label>
           <Input id="name" value="Pedro Duarte" className="col-span-3" onChange={(e) => console.log(e)}  />
         </div>
         <div className="grid grid-cols-4 items-center gap-4">
           <Label htmlFor="username" className="text-right">
             Username
           </Label>
           <Input id="username" value="@peduarte" className="col-span-3"  onChange={(e) => console.log(e)} />
         </div>
       </div>
       <DialogFooter>
         <Button onClick={closeCreateDialog}>Cancel</Button>
       </DialogFooter>
       <DialogFooter>
         <Button type="submit">Save changes</Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>
   </div>
    );
  }
  