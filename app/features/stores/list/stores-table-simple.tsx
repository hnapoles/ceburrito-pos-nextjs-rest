'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button-rounded-sm';

import { StoreBase } from '@/app/models/stores-model';

import StoresTableRow from './stores-table-row';

export default function StoresTableSimple({
  data,
  limit,
  page,
  totalDataCount,
}: {
  data: StoreBase[];
  limit: number;
  page: number;
  totalDataCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const rowsPerPage = 10;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    //router.push(`/?offset=${offset}`, { scroll: false });
    router.push(`${pathname}?page=${page + 1}&limit=${limit}`, {
      scroll: false,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stores</CardTitle>
        <CardDescription>Manage stores.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <StoresTableRow key={row._id} store={row} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.max(1, Math.min(limit - rowsPerPage, totalDataCount) + 1)}-
              {Math.min(limit, totalDataCount)}
            </strong>{' '}
            of <strong>{totalDataCount}</strong> products
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={false}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={limit > totalDataCount}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
