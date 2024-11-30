import {getTranslations} from 'next-intl/server';
import { UpdateBtn } from '@/app/ui/button';
import { DeleteOrder } from '@/app/ui/order/deleteButton';
import { Order } from '@/app/lib/definitions';
import { fetchOrder } from '@/app/lib/data';
import { Badge } from "flowbite-react";

export default async function OrderTable({
  queryStr,
  pageNo,
  pageSize
}: {
  queryStr: string;
  pageNo: number;
  pageSize: number;
}) {
  const [order] = await Promise.all([fetchOrder(queryStr,pageNo,pageSize)]);
  const i18n = await getTranslations('order');
  
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="bg-gray-50 p-2 md:pt-0 dark:bg-gray-900">
          <div className="md:hidden">
            {order?.map((b:Order) => (
              <div
                key={b.documentId}
                className="mb-2 w-full rounded-md bg-white p-4 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center dark:text-white">
                      <p className='ml-2'>{b.name}</p>
                    </div>
                  </div>
                  {b.payment_status? <Badge color="success">{i18n('available')}</Badge>:<Badge color="failure">{i18n('unavailable')}</Badge>}
                </div>
                <div className="flex w-full items-center justify-between pt-4 dark:text-white">
                  <div className="flex justify-end gap-2 dark:text-white">
                    <UpdateBtn url={`/order/${b.documentId}/edit`} />
                    <DeleteOrder id={b.documentId} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 dark:text-white">
                  {i18n('name')}
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 dark:text-white">
                  {i18n('status')}
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {order?.map((b:Order) => (
                <tr
                  key={b.documentId}
                  className="w-full py-3 text-sm last-of-type:border-none hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <td className="w-1/5 whitespace-nowrap py-3 pl-6 pr-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <p>{b.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <p>{b.payment_status? <Badge color="success">{i18n('available')}</Badge>:<Badge color="failure">{i18n('unavailable')}</Badge>}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 text-gray-900 dark:text-white">
                    <div className="flex items-center justify-end gap-3">
                    
                      <UpdateBtn url={`/order/${b.documentId}/edit`}  />
                      <DeleteOrder id={b.documentId} />
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
