'use client'
import React, { useEffect, useState, useRef, ChangeEvent } from "react";

import { ProductData } from "@/app/model/products-model";
import { Lookup } from "@/app/model/lookups-model";

import ProductUpdateFormImage from "./product-update-form-image";

import {
    Card,
    CardContent,
    CardDescription,
    //CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';


export default function ProductUpdateForm({ product, types, categories }: { product: ProductData, types: Lookup[], categories: Lookup[] }) {

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product</CardTitle>
                <CardDescription>
                    Edit product.
                    Url here = {imageUrl}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Image Upload */}
                <ProductUpdateFormImage imageUrl={imageUrl} setImageUrl={setImageUrl}/>

                {/* Edit Details */}


            </CardContent>
        </Card>
    )
}