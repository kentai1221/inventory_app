import Image from 'next/image';
import { UpdateInvoice} from '@/app/ui/invoices/buttons';
import { DeleteInvoice } from '@/app/ui/invoices/deleteButton';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { Invoice } from '@/app/lib/definitions';
const qs = require('qs');
import { fetchInvoices } from '@/app/lib/data';

export default async function InvoicesTable({
  queryStr,
  pageNo,
  pageSize
}: {
  queryStr: string;
  pageNo: number;
  pageSize: number;
}) {
  const [invoices] = await Promise.all([fetchInvoices(queryStr,pageNo,pageSize)]);

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="bg-gray-50 p-2 md:pt-0 dark:bg-gray-900">
          <div className="md:hidden">
            {invoices?.map((invoice:Invoice) => (
              <div
                key={invoice.documentId}
                className="mb-2 w-full rounded-md bg-white p-4 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center dark:text-white">
                      <Image
                        src={invoice.customer.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.customer.name}'s profile picture`}
                      />
                      <p>{invoice.customer.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-white">{invoice.customer.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.invoice_status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4 dark:text-white">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2 dark:text-white">
                    <UpdateInvoice id={invoice.documentId} />
                    <DeleteInvoice id={invoice.documentId} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 dark:text-white">
                  客戶
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  電郵
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  金額
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  日期
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  狀態
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {invoices?.map((invoice:Invoice) => (
                <tr
                  key={invoice.documentId}
                  className="w-full py-3 text-sm last-of-type:border-none hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.customer.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.customer.name}'s profile picture`}
                      />
                      <p>{invoice.customer.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    {invoice.customer.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    <InvoiceStatus status={invoice.invoice_status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 text-gray-900 dark:text-white">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.documentId} />
                      <DeleteInvoice id={invoice.documentId} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
