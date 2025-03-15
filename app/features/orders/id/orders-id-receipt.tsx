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
import { OrganizationBase } from '@/app/models/organizations-model';

interface OrderReceiptProps {
  org: OrganizationBase;
  order: OrderBase;
  showQrCode: boolean;
  showButtons?: string;
}

const pubSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://pos.ceburrito.ph/pub';

export default function OrdersByIdReceipt({
  org,
  order,
  showQrCode = true,
  showButtons,
}: OrderReceiptProps) {
  const receiptUrlForDownload = `${pubSiteUrl}/orders/${order._id}/receipt?pubKey=${order.pubKey}`;
  const receiptUrlForQrCode = `${pubSiteUrl}/orders/${order._id}/receipt?pubKey=${order.pubKey}&showButtons=true`;

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
      /*
      const response = await fetch(
        `/api/pdf?url=${encodeURIComponent(receiptUrlForDownload)}`,
      );
      */

      const response = await fetch(`/api/pdf?url=${receiptUrlForDownload}`);

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
      <CardHeader className="flex flex-col items-center justify-center text-center space-y-2 text-sm">
        <div>
          <Image
            src={org.imageUrl || '/logos/3.png'}
            width={50}
            height={10}
            className="md:block"
            alt="ceburrito.ph"
            priority
          />
        </div>

        <div>
          <CardTitle className="text-xl font-semibold">{org.name}</CardTitle>
          <p className="text-sm text-gray-500 hidden">Order ID: {order._id}</p>

          {org.owner === org.operator ? (
            <div>
              <p>Owned and Operated By</p>
              <p>{org.owner.toUpperCase()}</p>
            </div>
          ) : (
            <div>
              <p>Owned by {org.owner}</p>
              <p>Operated by {org.operator}</p>
            </div>
          )}

          <p className="text-lg font-semibold"></p>
          <p>{org.addressLine1}</p>
          <p>{org.addressLine2}</p>
          <p className="mt-2">NON VAT REG TIN : {org.nonVatRegTin}</p>
          <p>MIN : {org.birMinNumber}</p>
          <p>S/N : {order._id?.slice(0, 8).toUpperCase()}</p>
          <p className="mt-2">SALES INVOICE</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 text-sm">
          <p>
            <strong>Ordered At:</strong>{' '}
            {order.orderedAt
              ? format(new Date(order.orderedAt), 'PPpp')
              : 'N/A'}
          </p>
          <p>
            <strong>Sales Invoice # </strong>{' '}
            {order._id?.slice(-6).toUpperCase()}
          </p>
          <p>
            <strong>Ceburrito # </strong>{' '}
            {order._id?.slice(8, -6).toUpperCase()}
          </p>
          <p>
            <strong>Customer:</strong> {order.customerName}{' '}
            {order.customerEmail && <span>({order.customerEmail})</span>}
          </p>
          <p>
            <strong>Cashier:</strong> {order.updatedBy?.split('@')[0] || 'pos'}
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
          <p className="hidden">
            <strong>Status:</strong> {order.status}
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
        {showButtons && (
          <div className="flex justify-end items-center mt-6 hidden">
            <Button onClick={handleDownloadPDF2} disabled={processing}>
              {processing ? (
                <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
              ) : (
                'Download as PDF'
              )}
            </Button>
          </div>
        )}
        {showQrCode && (
          <div className="flex justify-center mb-4">
            <QRCode value={receiptUrlForQrCode} size={64} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
