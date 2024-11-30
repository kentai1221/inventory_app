import {getTranslations} from 'next-intl/server';
import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import OrderTable from '@/app/ui/order/table';
import {CreateOrderBtn} from '@/app/ui/order/addOrderBtn'
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchOrderTotalPage } from '@/app/lib/data';
import Link from "next/link";
import {
  Breadcrumb,
  Button
} from "flowbite-react";
import {
  HiHome,
} from "react-icons/hi";

export default async function Page(
  props: {
    searchParams?: Promise<{
      query?: string;
      page?: string;
      size?: string
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const queryStr = searchParams?.query || '';
  const pageNo = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.size) || 5;

  const [total] = await Promise.all([fetchOrderTotalPage(queryStr,pageSize)]);

  const i18n = await getTranslations('order');

  return (

    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-5">
              <Breadcrumb.Item>
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <Link href="/"><span className="dark:text-white">{i18n('main')}</span></Link>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{i18n('order')}</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            {i18n('order')}
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
              <Search placeholder={i18n('search')} />
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <Link href="/order/create"><Button>{i18n('create')}</Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 mt-2 flex w-full flex-col items-start sm:flex-row sm:items-center dark:text-white">
          <Pagination totalPages={total.totalPages} totalItems={total.totalItems} />
      </div>

      <div className="flex flex-col mb-10">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <Suspense key={queryStr + pageNo} fallback={<InvoicesTableSkeleton />}>
                <OrderTable queryStr={queryStr} pageNo={pageNo} pageSize={pageSize} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
    
  );
}