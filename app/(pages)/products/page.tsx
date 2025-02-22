import ProductsMainPage from '@/app/features/products/list/products-main-page';
import NotFound from './not-found';
import { GetProducts } from '@/app/actions/server/products-actions';

export default async function Page(props: {
  searchParams: Promise<{ keyword: string; page: string; limit: string }>;
}) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? null;
  const limit = searchParams.limit ?? '10';
  const page = searchParams.page ?? '1';

  const results = await GetProducts(keyword, page, limit);
  const products = results.data;
  const totalProducts = results.count;

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
