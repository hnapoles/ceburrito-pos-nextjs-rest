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
import { StoreBase } from '@/app/models/stores-model';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
import { useRouter } from 'next/navigation';

export default function StoresChangePage() {
  const { storeName, setStoreName } = useStoreName();
  const [stores, setStores] = useState<StoreBase[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getStores = async () => {
      const storesLookup = await GetLookupStores();
      setStores(storesLookup);
    };
    getStores();
  }, [storeName]);

  const handleSelectStore = (name: string) => {
    setStoreName(name);
    router.push('/dashboard');
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
