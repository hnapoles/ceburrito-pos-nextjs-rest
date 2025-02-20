import { useDialogStore } from '@/app/provider/zustand-provider';

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

import { Button } from '@/components/ui/button';

export default function TabProductPricesDialogCreate() {

    const { isCreateDialogOpen, closeCreateDialog, toggleCreateDialog } = useDialogStore();

    return (
        <Dialog open={isCreateDialogOpen} onOpenChange={toggleCreateDialog}>
            {/*<DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            */}
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle>Add Product Prices</DialogTitle>
                    <DialogDescription>
                       {`Add product prices for product x`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" className="col-span-3" onChange={(e) => console.log(e)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input id="username" value="@peduarte" className="col-span-3" onChange={(e) => console.log(e)} />
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
    )
}