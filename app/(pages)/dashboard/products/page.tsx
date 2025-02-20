import { apiClientDq } from '@/lib/fetch-helper';

import { IProduct, IGetProductsResults } from '@/app/model/products-model';
import { ApiOperationNames, FindAll } from '@/app/model/api-model';

import ProductsMainPage from '@/app/modules/products/list/products-main-page';
import NotFound from './not-found';
import { GetProducts } from '@/app/action/server/products-actions';

export default async function Page(props: {
  searchParams: Promise<{ keyword: string; page: string; limit: string }>;
}) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? null;
  const limit = searchParams.limit ?? '10';
  const page = searchParams.page ?? '1';

  const results = GetProducts(keyword, page, limit);
  const products = (await results).data;
  const totalProducts = (await results).count;

  if (products) {
    return (
      <ProductsMainPage
        products={products}
        limit={parseInt(limit)}
        page={parseInt(page)}
        totalDataCount={totalProducts}
      />
    );
  }

  if (!products) {
    return <NotFound />;
  }
}
