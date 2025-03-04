'use server';

import { apiClientDq } from '@/lib/fetch-helper';

import { ProductBase, FindProductsOutput } from '@/app/models/products-model';
import {
  ApiOperationNames,
  FindAllProps,
  FindOneProps,
} from '@/app/models/api-model';

export async function DeleteProductById(id: string) {
  const entity = 'product';
  const operation = ApiOperationNames.Delete;
  const method = 'POST';

  const result = await apiClientDq<ProductBase, ProductBase>(
    entity,
    operation,
    id,
    { method: method },
  );

  return result;
}

export async function CreateProduct(data: ProductBase) {
  const entity = 'product';
  const operation = ApiOperationNames.Create;
  const id = '';
  const method = 'POST';

  const result = await apiClientDq<ProductBase, ProductBase>(
    entity,
    operation,
    id,
    { method: method, body: data },
  );

  return result;
}

export async function UpdateProduct(data: ProductBase) {
  const entity = 'product';
  const operation = ApiOperationNames.Update;
  const id = data._id;
  const method = 'POST';
  delete data._id;

  const result = await apiClientDq<ProductBase, ProductBase>(
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
  status: string,
  isSellable?: boolean,
  category?: string,
) {
  const andFilter = {
    ...(status !== 'all' && { status }),
    ...(category !== 'all' && { category }),
    ...(isSellable !== undefined && { isSellable }),
  };
  const apiProps: FindAllProps = {
    entity: 'product',
    //...(status !== 'all' && { andFilter: { status } }), // Conditionally add andFilter
    andFilter,
    keyword: keyword,
    searchKeywordFields: ['name', 'description'],
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    const results = await apiClientDq<FindProductsOutput, FindAllProps>(
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

  const product = await apiClientDq<ProductBase, FindOneProps>(
    'product',
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );

  return product;
}
