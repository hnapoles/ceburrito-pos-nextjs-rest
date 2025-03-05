'use client';
import React, {
  useState,
  //useEffect,
  //useRef,
  //ChangeEvent
} from 'react';

import { StoreBase } from '@/app/models/stores-model';
//import { Lookup } from "@/app/model/lookups-model";

import StoreUpdateFormImage from './store-update-form-image';
import StoreUpdateFormDetails from './store-update-form-details';

import {
  Card,
  CardContent,
  CardDescription,
  //CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';

export default function StoreUpdateForm({ store }: { store: StoreBase }) {
  const thisImageUrl = store.imageUrl ?? null;
  const [imageUrl, setImageUrl] = useState<string | null>(thisImageUrl);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store</CardTitle>
        <CardDescription>Edit store.</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Image Upload */}
        <StoreUpdateFormImage imageUrl={imageUrl} setImageUrl={setImageUrl} />

        {/* Edit Details */}
        <StoreUpdateFormDetails entity={store} imageUrl={imageUrl} />
      </CardContent>
    </Card>
  );
}
