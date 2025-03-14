'use client';

import React from 'react';
//import { useRouter } from 'next/navigation';

import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import { OrderBase } from '@/app/models/orders-model';
import { Button } from '@/components/ui/button-rounded-sm';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';

import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Loader2 } from 'lucide-react';

interface OrderReceiptProps {
  order: OrderBase;
  showQrCode: boolean;
}

const pubSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://pos.ceburrito.ph/pub';

export default function OrdersByIdReceipt({
  order,
  showQrCode = true,
}: OrderReceiptProps) {
  const receiptUrl = `${pubSiteUrl}/orders/${order._id}/receipt?pubKey=${order.pubKey}`;

  //const router = useRouter();

  const handleDownloadPDF = async () => {
    const receiptElement = document.getElementById('receipt-content');
    if (!receiptElement) return;

    // Ensure fonts and styles are rendered correctly
    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      windowWidth: receiptElement.scrollWidth,
      windowHeight: receiptElement.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
    pdf.save(`receipt_${order._id}.pdf`);
  };

  const [processing, setProcessing] = React.useState(false);
  /*
  const handleDownloadPDF2 = async () => {
    setProcessing(true);
    router.push(`/api/pdf?url=${encodeURIComponent(receiptUrl)}`);
    setProcessing(false);
  };
*/

  const handleDownloadPDF2 = async () => {
    setProcessing(true);

    try {
      console.log('Generating PDF...');
      const response = await fetch(
        `/api/pdf?url=${encodeURIComponent(receiptUrl)}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }

      // Convert response to Blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${order._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProcessing(false); // ✅ This now gets executed after fetch completes
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 shadow-lg rounded-lg">
      <CardHeader>
        <div className="grid grid-cols-2">
          <div>
            <CardTitle className="text-xl font-semibold">
              Order Receipt
            </CardTitle>
            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
          </div>
          {showQrCode && (
            <div className="flex justify-center mb-4">
              <QRCode value={receiptUrl} size={64} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm">
          <p>
            <strong>Customer:</strong> {order.customerName}{' '}
            {order.customerEmail && <span>({order.customerEmail})</span>}
          </p>
          <p>
            <strong>Store:</strong> {order.storeName}
          </p>
          <p>
            <strong>Order Mode:</strong> {order.mode}
          </p>
          <p>
            <strong>Payment:</strong> {order.paymentMethod}{' '}
            {order.paymentReference && <span>({order.paymentReference})</span>}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Ordered At:</strong>{' '}
            {order.orderedAt
              ? format(new Date(order.orderedAt), 'PPpp')
              : 'N/A'}
          </p>
          <p>
            <strong>Total Amount:</strong>{' '}
            {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Spice</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.orderLines?.map((line) => (
              <TableRow
                key={line.productId}
                className={cn(line.status === 'canceled' ? 'hidden' : '')}
              >
                <TableCell className="flex items-center space-x-2">
                  {line.imageUrl && (
                    <Image
                      src={line.imageUrl}
                      alt={line.productName}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <span>{line.productName}</span>
                </TableCell>
                <TableCell>{line.sizeOption || '-'}</TableCell>
                <TableCell>{line.spiceOption || '-'}</TableCell>
                <TableCell className="text-right">{line.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatPesoNoDecimals(Math.floor(line.unitPrice || 0))}
                </TableCell>
                <TableCell className="text-right">
                  {formatPesoNoDecimals(Math.floor(line.amount || 0))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end items-center mt-6 hidden">
          <Button onClick={handleDownloadPDF}>Download Receipt</Button>
        </div>
        <div className="flex justify-end items-center mt-6">
          <Button onClick={handleDownloadPDF2} disabled={processing}>
            {processing ? (
              <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
            ) : (
              'Download as PDF'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
