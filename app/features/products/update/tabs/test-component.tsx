import { useGlobalStore } from '@/app/provider/zustand-provider';

export function TestComponent() {
  const productSellingPrices = useGlobalStore(
    (state) => state.productSellingPrices,
  );

  console.log('prices from test component... ', productSellingPrices);

  if (!productSellingPrices) {
    return null;
  }

  return <div>{JSON.stringify(productSellingPrices, null, 2)}</div>;
}
