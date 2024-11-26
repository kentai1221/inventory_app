import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import Link from "next/link";
import { LatestInvoice } from '@/app/lib/definitions';
import {getLocale, getTranslations} from 'next-intl/server';

export default async function LatestInvoices({
  latestInvoices,
}: {
  latestInvoices: LatestInvoice[];
}) {

  const i18n = await getTranslations('mainpage');
  const locale = await getLocale();

  const data = [
    {
      "name":"名字 1",
      "name_en":"Name 1",
      "desc":"Description",
      "record":"Record 1"
    },
    {
      "name":"名字 2",
      "name_en":"Name 2",
      "desc":"Description",
      "record":"Record 2"
    },
    {
      "name":"名字 3",
      "name_en":"Name 3",
      "desc":"Description",
      "record":"Record 3"
    },
    {
      "name":"名字 4",
      "name_en":"Name 4",
      "desc":"Description",
      "record":"Record 4"
    },
    {
      "name":"名字 5",
      "name_en":"Name 5",
      "desc":"Description",
      "record":"Record 5"
    },
    {
      "name":"名字 6",
      "name_en":"Name 6",
      "desc":"Description",
      "record":"Record 6"
    }
  ]

  return (
    <div className="mb-4 h-full rounded-lg bg-white p-4 shadow sm:p-6 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          {i18n('table')}
        </h3>
        <Link
          href="#"
          className="inline-flex items-center rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
        >
          {i18n('view_all')}
        </Link>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* {latestInvoices.map((invoice, i) => (
            <li key={invoice.customer.name} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                  <Image
                    alt=""
                    height={32}
                    src={invoice.customer.image_url}
                    width={32}
                    className="rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {invoice.customer.name}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {invoice.customer.email}
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {invoice.amount}
                </div>
              </div>
            </li>
          ))} */}
          {data.map((record, i) => (
          <li key={`${i}`} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                  <div className="rounded-full h-8 w-8 relative overflow-hidden bg-gray-100 dark:bg-gray-600" data-testid="flowbite-avatar-img">
                    <svg className="absolute -bottom-1 h-auto w-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {locale=="en"? record.name_en:record.name}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {record.desc}
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {record.record}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 sm:pt-6 dark:border-gray-700">
        <div className="shrink-0">
          <Link
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 sm:text-sm dark:text-primary-500 dark:hover:bg-gray-700"
          >
            {i18n('report')}
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>

  );
}
