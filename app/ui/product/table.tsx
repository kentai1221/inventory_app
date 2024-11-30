import {getTranslations} from 'next-intl/server';
import { UpdateBtn } from '@/app/ui/button';
import { DeleteProduct } from '@/app/ui/product/deleteButton';
import { Product } from '@/app/lib/definitions';
import { fetchProduct } from '@/app/lib/data';
import { Badge } from "flowbite-react";
import Image from 'next/image';

export default async function ProductTable({
  queryStr,
  pageNo,
  pageSize
}: {
  queryStr: string;
  pageNo: number;
  pageSize: number;
}) {
  const [product] = await Promise.all([fetchProduct(queryStr,pageNo,pageSize)]);
  const i18n = await getTranslations('product');
 
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="bg-gray-50 p-2 md:pt-0 dark:bg-gray-900">
          <div className="md:hidden">
            {product?.map((b:Product) => (
              <div
                key={b.documentId}
                className="mb-2 w-full rounded-md bg-white p-4 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center dark:text-white">
                      <div className="h-20 w-20 relative overflow-hidden bg-gray-100 dark:bg-gray-600" data-testid="flowbite-avatar-img">
                        <div
                            style={{
                                display: 'grid',
                                gridGap: '8px',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 80px))',
                            }}
                            >
                            <div style={{ position: 'relative', height: '80px' }}>
                                <Image
                                alt={b.name}
                                src={b.image?.[0].url?`${process.env.BACKEND_URL}${b.image[0].url}`:`/product.png`}
                                fill
                                style={{
                                    objectFit: 'contain',
                                }}
                                />
                            </div>
                        </div>
                      </div>
                      <div className="ml-2 flex flex-col">
                        <p>{b.name}</p>
                        <p>{b.code?`#${b.code}`:``}</p>
                      </div>
                    </div>
                  </div>
                  {b.product_status? <Badge color="success">{i18n('available')}</Badge>:<Badge color="failure">{i18n('unavailable')}</Badge>}
                </div>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex w-full items-center justify-center mt-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white">
                      <p>{i18n('quantity')}</p>
                  </div>
                  <div className="flex w-full items-center justify-between ml-4 pt-4 dark:text-white">
                      <p>{b.quantity}</p>
                  </div>
                  <div className="flex w-full items-center justify-center mt-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white">
                      <p>{i18n('price')}</p>
                  </div>
                  <div className="flex w-full items-center justify-between ml-4 pt-4 dark:text-white">
                      <p>${b.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2">
                  <div className="flex w-full items-center justify-center mt-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white">
                      <p>{i18n('brand')}</p>
                  </div>
                  <div className="flex w-full items-center justify-between ml-4 pt-4 dark:text-white">
                      <p>{b.brand?.name}</p>
                  </div>
                  <div className="flex w-full items-center justify-center mt-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white">
                      <p>{i18n('category')}</p>
                  </div>
                  <div className="flex w-full items-center justify-between ml-4 pt-4 dark:text-white">
                      <p>{b.category?.name}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-6 dark:text-white">
                  <div className="flex justify-end gap-2 dark:text-white">
                    <UpdateBtn url={`/product/${b.documentId}/edit`} />
                    <DeleteProduct id={b.documentId} />
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
                  {i18n('code')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('quantity')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('price')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('brand')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('category')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('status')}
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {product?.map((b:Product) => (
                <tr
                  key={b.documentId}
                  className="w-full py-3 text-sm last-of-type:border-none hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <td className="w-1/5 whitespace-nowrap py-3 pl-6 pr-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="h-20 w-20 relative overflow-hidden bg-gray-100 dark:bg-gray-600" data-testid="flowbite-avatar-img">
                        <div
                            style={{
                                display: 'grid',
                                gridGap: '8px',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 80px))',
                            }}
                            >
                            <div style={{ position: 'relative', height: '80px' }}>
                                <Image
                                alt={b.name}
                                src={b.image?.[0].url?`${process.env.BACKEND_URL}${b.image[0].url}`:`/product.png`}
                                fill
                                style={{
                                    objectFit: 'contain',
                                }}
                                />
                            </div>
                        </div>
                      </div>
                      <p>{b.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 px-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <p>{b.code?`#${b.code}`:``}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 px-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <p>{b.quantity}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 px-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <p>${b.price}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 px-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <p>{b.brand?.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 px-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <p>{b.category?.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 px-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <p>{b.product_status? <Badge color="success">{i18n('available')}</Badge>:<Badge color="failure">{i18n('unavailable')}</Badge>}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 px-3 text-gray-900 dark:text-white">
                    <div className="flex items-center justify-end gap-3">
                    
                      <UpdateBtn url={`/product/${b.documentId}/edit`}  />
                      <DeleteProduct id={b.documentId} />
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
