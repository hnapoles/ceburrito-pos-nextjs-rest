'use server';

import {
  FindProductSellingPricesOutput,
  ProductSellingPriceBase,
} from '@/app/models/products-model';

import { apiClientDq } from '@/lib/fetch-helper';
import { FindAllProps, FindOneProps } from '@/app/models/api-model';

import { ApiOperationNames } from '@/app/models/api-model';

export async function GetProductSellingPricesByProductId(id: string) {
  const productSellingPricesProps = {
    andFilter: {
      productId: id,
    },
    limit: 999,
    page: 1,
    sortOptions: [
      {
        sortField: 'orderType',
        sortOrder: 1,
      },
      {
        sortField: 'storeName',
        sortOrder: 1,
      },
      {
        sortField: 'customerName',
        sortOrder: 1,
      },
    ],
  };

  const entity = 'product_selling_price';
  const operation = ApiOperationNames.FindAll;
  const method = 'POST';

  const result = await apiClientDq<
    FindProductSellingPricesOutput,
    FindAllProps
  >(entity, operation, id, { method: method, body: productSellingPricesProps });

  return result;
}

export async function GetProductSellingPricesByOwnId(id: string) {
  const entity = 'product_selling_price';
  const operation = ApiOperationNames.FindOne;
  const method = 'POST';

  console.log('id in api call ', id);

  const result = await apiClientDq<ProductSellingPriceBase, FindOneProps>(
    entity,
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );

  return result;
}

export async function CreateProductSellingPrices(
  data: ProductSellingPriceBase,
) {
  const entity = 'product_selling_price';
  const operation = ApiOperationNames.Create;
  const id = '';
  const method = 'POST';

  const result = await apiClientDq<
    ProductSellingPriceBase,
    ProductSellingPriceBase
  >(entity, operation, id, { method: method, body: data });

  return result;
}

export async function DeleteProductSellingPriceById(id: string) {
  const entity = 'product_selling_price';
  const operation = ApiOperationNames.Delete;
  const method = 'POST';

  const result = await apiClientDq<
    ProductSellingPriceBase,
    ProductSellingPriceBase
  >(entity, operation, id, { method: method });

  return result;
}
