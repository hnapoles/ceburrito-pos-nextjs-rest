'use server';

import { apiClientDq } from '@/lib/fetch-helper';

import { ProductData, IGetProductsResults } from '@/app/models/products-model';
import { ApiOperationNames, FindAll, FindOne } from '@/app/models/api-model';

export async function DeleteProductById(id: string) {
  const entity = 'product';
  const operation = ApiOperationNames.Delete;
  const method = 'POST';

  const result = await apiClientDq<ProductData, ProductData>(
    entity,
    operation,
    id,
    { method: method },
  );

  return result;
}

export async function CreateProduct(data: ProductData) {
  const entity = 'product';
  const operation = ApiOperationNames.Create;
  const id = '';
  const method = 'POST';

  const result = await apiClientDq<ProductData, ProductData>(
    entity,
    operation,
    id,
    { method: method, body: data },
  );

  return result;
}

export async function UpdateProduct(data: ProductData) {
  const entity = 'product';
  const operation = ApiOperationNames.Update;
  const id = data._id;
  const method = 'POST';

  const result = await apiClientDq<ProductData, ProductData>(
    entity,
    operation,
    id,
    { method: method, body: data },
  );

  return result;
}

export async function GetProducts(
  keyword: string,
  page: string,
  limit: string,
) {
  const apiProps: FindAll = {
    entity: 'product',
    keyword: keyword,
    searchKeywordFields: ['name', 'description'],
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    const results = await apiClientDq<IGetProductsResults, FindAll>(
      'product',
      ApiOperationNames.FindAll,
      '',
      { method: 'POST', body: apiProps },
    );
    return results;
  } catch (error) {
    console.log('error calling api ', error);
    throw error;
  }
}

export async function GetProductById(id: string) {
  const method = 'POST';

  const product = await apiClientDq<ProductData, FindOne>(
    'product',
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );

  return product;
}
