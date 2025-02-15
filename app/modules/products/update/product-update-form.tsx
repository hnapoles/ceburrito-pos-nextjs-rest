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
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product</CardTitle>
                <CardDescription>
                    Edit product.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Image Upload */}
                <ProductUpdateFormImage/>

                {/* Edit Details */}


            </CardContent>
        </Card>
    )
}