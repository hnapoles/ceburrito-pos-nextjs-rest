'use client';
import React, {
  useState,
  //useEffect,
  //useRef,
  //ChangeEvent
} from 'react';

import { ProductData } from '@/app/model/products-model';
import { Lookup } from '@/app/model/lookups-model';

import ProductUpdateFormImage from './product-update-form-image';
import ProductUpdateFormDetails from './product-update-form-details';

import {
  Card,
  CardContent,
  CardDescription,
  //CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useGlobalStore } from '@/app/provider/zustand-provider';

export default function ProductUpdateForm({
  types,
  categories,
}: {
  types: Lookup[];
  categories: Lookup[];
}) {
  const product = useGlobalStore((state) => state.product);

  const thisImageUrl = product?.imageUrl ?? null;
  const [imageUrl, setImageUrl] = useState<string | null>(thisImageUrl);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Product</CardTitle>
          <CardDescription>Edit product.</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Image Upload */}
          <ProductUpdateFormImage
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />

          {/* Edit Details */}
          <ProductUpdateFormDetails
            types={types}
            categories={categories}
            imageUrl={imageUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}
