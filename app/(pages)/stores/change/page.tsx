'use client';

import { useEffect, useState } from 'react';
import { useStoreName } from '@/app/providers/zustand-provider';

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

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
import { useRouter } from 'next/navigation';

export default function StoresChangePage() {
  const { storeName, setStoreName, setStoreColor } = useStoreName();
  const [stores, setStores] = useState<OrganizationBase[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getStores = async () => {
      const storesLookup = await GetLookupStores();
      setStores(storesLookup);
    };
    getStores();
  }, [storeName]);

  const handleSelectStore = (name: string) => {
    const selectedStore = stores.find((s) => s.name === name);

    if (selectedStore) {
      setStoreColor(selectedStore.color || 'purple-500');
    }

    setStoreName(name);
    router.back();
  };
  return (
    <Card className="max-w-md mx-auto shadow-md border border-gray-300">
      <CardHeader>
        <CardTitle>Select a Store</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select onValueChange={(value) => handleSelectStore(value)}>
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
        <div className="text-sm text-gray-600">
          Please contact the manager or system administrator if you do not have
          access to the store.
        </div>
      </CardContent>
    </Card>
  );
}

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
