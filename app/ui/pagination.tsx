'use client';
import {useTranslations} from 'next-intl';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
 Select

} from "flowbite-react";

export default function Pagination({ totalPages, totalItems }: { totalPages: number, totalItems: number }) {
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('size')) || 5;
  const allPages = generatePagination(currentPage, totalPages);
  const { replace } = useRouter();
  const i18n = useTranslations('pagination');

  const createPageURL = (pageNumber: number, size: number = pageSize) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    params.set('size', size.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(event.target.value);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('size', newSize.toString());
    replace(`${pathname}?${params.toString()}`);
    //setSearchParams(new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), size: newSize.toString(), page: '1' }));
  };

  return (
    <>
        <div className="flex items-center mr-5">
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />

          <div className="flex -space-x-px">
            {allPages.map((page, index) => {
              let position: 'first' | 'last' | 'single' | 'middle' | undefined;

              if (index === 0) position = 'first';
              if (index === allPages.length - 1) position = 'last';
              if (allPages.length === 1) position = 'single';
              if (page === '...') position = 'middle';

              return (
                <PaginationNumber
                  key={page}
                  href={createPageURL(page)}
                  page={page}
                  position={position}
                  isActive={currentPage === page}
                />
              );
            })}
          </div>

          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
          />
        </div>

        <div className="flex items-center mt-5 sm:mt-0 sm:ml-auto">
          {i18n('show_per_page')}
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-4"
          >
            <option key={5} value="5">5</option>
            <option key={10} value="10">10</option>
            <option key={20} value="20">20</option>
            <option key={100} value="100">100</option>
          </Select>
          {i18n('total')} {totalItems} {i18n('item')}
        </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx(
    'flex h-8 w-10 items-center justify-center text-sm border dark:border-gray-500',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-gray-400 border-gray-200 text-white dark:bg-gray-700 dark:border-gray-500': isActive,
      'hover:bg-gray-100 hover:dark:bg-gray-800': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-8 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300 dark:border-gray-700 dark:text-gray-500': isDisabled,
      'hover:bg-gray-100 hover:dark:bg-gray-800 dark:border-gray-400 dark:text-gray-200': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
