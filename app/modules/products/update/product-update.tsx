'use client'

import { ProductData } from "@/app/model/products-model";
import { Lookup } from "@/app/model/lookups-model";

import ProductUpdateForm from "./product-update-form";
import ProductUpdateTabs from "./product-update-tabs";


export default function ProductUpdate({ product, types, categories }: { product: ProductData, types: Lookup[], categories: Lookup[] }) {

    return (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Product Image and Details */}
            <div>
                <ProductUpdateForm product={product} types={types} categories={categories} />
            </div>
            
            {/* Right Side - Product Tabs */}
            <div>
                <ProductUpdateTabs/>
            </div>

        </div>
    )

}