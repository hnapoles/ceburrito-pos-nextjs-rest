import ProductsMainPage from '@/app/features/products/list/products-main-page';
import NotFoundGlobal from '@/app/nav/not-found-global';
import { GetProducts } from '@/app/actions/server/products-actions';
import { GetLookups } from '@/app/actions/server/lookups-actions';

export default async function Page(props: {
  searchParams: Promise<{
    keyword: string;
    page: string;
    limit: string;
    status: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? null;
  const limit = searchParams.limit ?? '10';
  const page = searchParams.page ?? '1';
  const status = searchParams.status ?? 'all';

  const results = await GetProducts(keyword, page, limit, status);
  const products = results.data;
  const totalProducts = results.count;

  const { data: statusesLookup } = await GetLookups('product', 'status');

  if (products) {
    return (
      <ProductsMainPage
        products={products}
        limit={parseInt(limit)}
        page={parseInt(page)}
        totalDataCount={totalProducts}
        statusesLookup={statusesLookup}
        currentTab={status}
      />
    );
  }

  if (!products) {
    <NotFoundGlobal display={'Product data not found'} backUrl={'/product'} />;
  }
}
