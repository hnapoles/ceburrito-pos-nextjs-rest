export const formatPesoNoDecimals = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatPeso = (amount: number | null | undefined) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

//console.log(formatPesoNoDecimals(1000)); // ₱1,000

/*
import { useMemo } from "react";

const usePesoFormatter = (amount: number) => {
  return useMemo(() => formatPeso(amount), [amount]);
};

const PriceDisplay = ({ price }: { price: number }) => {
  const formattedPrice = usePesoFormatter(price);
  return <p>{formattedPrice}</p>;
};

*/

/*
const MyComponent = ({ price }: { price: number }) => {
  return <span>{formatPeso(price)}</span>;
};

*/
