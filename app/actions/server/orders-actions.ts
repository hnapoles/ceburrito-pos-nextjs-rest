'use server';

import { apiClientDq } from '@/lib/fetch-helper';

import { OrderBase, FindOrdersOutput } from '@/app/models/orders-model';
import {
  ApiOperationNames,
  FindAllProps,
  FindOneProps,
} from '@/app/models/api-model';

export async function DeleteOrderById(id: string) {
  const entity = 'order';
  const operation = ApiOperationNames.Delete;
  const method = 'POST';

  const result = await apiClientDq<OrderBase, OrderBase>(
    entity,
    operation,
    id,
    { method: method },
  );

  return result;
}

export async function CreateOrder(data: OrderBase) {
  const entity = 'order';
  const operation = ApiOperationNames.Create;
  const method = 'POST';
  const id = '';

  const result = await apiClientDq<OrderBase, OrderBase>(
    entity,
    operation,
    id,
    { method: method, body: data },
  );

  return result;
}

export async function UpdateOrder(data: OrderBase) {
  const entity = 'order';
  const operation = ApiOperationNames.Update;
  const id = data._id;
  const method = 'POST';

  const result = await apiClientDq<OrderBase, OrderBase>(
    entity,
    operation,
    id,
    { method: method, body: data },
  );

  return result;
}

export async function GetOrders(
  keyword: string,
  page: string,
  limit: string,
  status: string,
) {
  let apiProps: FindAllProps = {
    entity: 'order',
    ...(status !== 'all' && { andFilter: { status } }), // Conditionally add andFilter
    keyword: keyword,
    searchKeywordFields: ['name', 'description'],
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    const results = await apiClientDq<FindOrdersOutput, FindAllProps>(
      'order',
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

export async function GetOrderById(id: string) {
  const method = 'POST';

  const order = await apiClientDq<OrderBase, FindOneProps>(
    'order',
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );

  return order;
}
