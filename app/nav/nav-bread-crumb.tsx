'use client';

import React from 'react';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function PagesBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  const lastIndex = pathSegments.length - 1;
  const secondLastIndex = pathSegments.length - 2;

  const lastSegment = pathSegments[lastIndex] || 'Home';
  const lastTitle = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  const secondLastSegment =
    secondLastIndex >= 0 ? pathSegments[secondLastIndex] : null;
  const secondLastTitle = secondLastSegment
    ? secondLastSegment.charAt(0).toUpperCase() + secondLastSegment.slice(1)
    : null;

  return (
    <>
      {/* Full breadcrumb for md+ screens */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">POS</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === lastIndex;
            const title = segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
              <React.Fragment key={href}>
                {isLast ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={href}>{title}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Only last two breadcrumbs for sm screens */}
      <Breadcrumb className="flex md:hidden">
        <BreadcrumbList>
          {secondLastSegment && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/${pathSegments
                      .slice(0, secondLastIndex + 1)
                      .join('/')}`}
                  >
                    {secondLastTitle}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}

          <BreadcrumbItem>
            <BreadcrumbPage>{lastTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
