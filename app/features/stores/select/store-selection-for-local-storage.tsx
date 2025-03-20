'use client';

import { useEffect, useState } from 'react';
import { useStoreName } from '@/app/providers/zustand-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
//import { Button } from '@/components/ui/button';
import { GetLookupStores } from '@/app/actions/server/lookups-actions';
import { OrganizationBase } from '@/app/models/organizations-model';

const StoreSelectionModal = () => {
  const { storeName, setStoreName, setStoreColor } = useStoreName();
  const [open, setOpen] = useState(!storeName); // Open if no store selected
  const [stores, setStores] = useState<OrganizationBase[]>([]);

  useEffect(() => {
    const getStores = async () => {
      const storesLookup = await GetLookupStores();
      setStores(storesLookup);
    };
    getStores();

    setOpen(!storeName);
  }, [storeName]);

  const handleSelectStore = (name: string) => {
    const selectedStore = stores.find((s) => s.name === name);

    if (selectedStore) {
      setStoreColor(selectedStore.color || 'purple-500');
    }

    setStoreName(name);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Store</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/*
          <Button onClick={() => handleSelectStore('Store A')}>Store A</Button>
          <Button onClick={() => handleSelectStore('Store B')}>Store B</Button>
          */}
          <Select
            value={storeName ?? undefined}
            onValueChange={handleSelectStore} // No need for inline function
          >
            <SelectTrigger>
              <SelectValue placeholder="Select store name" />
            </SelectTrigger>

            <SelectContent>
              {stores.map((s) => (
                <SelectItem key={s._id} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm">
          Please contact manager and/or system administrator if you do not have
          access to the store.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreSelectionModal;

/*
 <Select
                    onValueChange={handleStoreChange}
                    {...field}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select store name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stores.map((s) => (
                        <SelectItem key={s._id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
*/
