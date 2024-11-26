import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import { UpdateInvoice} from '@/app/ui/button';
import { DeleteTrainee} from '@/app/ui/trainee/deleteButton';
import TraineeStatus from '@/app/ui/trainee/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { Trainee } from '@/app/lib/definitions';
const qs = require('qs');
import { fetchTrainee } from '@/app/lib/data';

export default async function TraineeTable({
  queryStr,
  pageNo,
  pageSize
}: {
  queryStr: string;
  pageNo: number;
  pageSize: number;
}) {
  const [trainee] = await Promise.all([fetchTrainee(queryStr,pageNo,pageSize)]);
  const i18n = await getTranslations('trainee');
  
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="bg-gray-50 p-2 md:pt-0 dark:bg-gray-900">
          <div className="md:hidden">
            {trainee?.map((t:Trainee) => (
              <div
                key={t.documentId}
                className="mb-2 w-full rounded-md bg-white p-4 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center dark:text-white">
                    <div className="rounded-full h-8 w-8 relative overflow-hidden bg-gray-100 dark:bg-gray-600" data-testid="flowbite-avatar-img">
                      <Image
                        alt=""
                        height={40}
                        src={t.image?.url?`${process.env.BACKEND_URL}${t.image.url}`:`/user.png`}
                        width={40}
                        className="mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                      />
                    </div>
                      <p className='ml-2'>{t.name_tc} ({t.trainee_no})</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-white">{t.name_en}</p><p className="mt-2 text-sm text-gray-500 dark:text-white">{t.gender}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4 dark:text-white">
                  <div>
                    <p className="text-sm mb-2">
                      {t.address_tc}
                    </p>
                    <p>{t.join_date?formatDateToLocal(t.join_date):""}</p>
                  </div>
                  <div className="flex justify-end gap-2 dark:text-white">
                    <UpdateInvoice url={`/trainee/${t.documentId}/edit`} />
                    <DeleteTrainee id={t.documentId} />
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
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('name_en')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('trainee_no')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('gender')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('email')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('join_date')}
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-white">
                  {i18n('ehealth')}
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {trainee?.map((t:Trainee) => (
                <tr
                  key={t.documentId}
                  className="w-full py-3 text-sm last-of-type:border-none hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                    <div className="rounded-full h-8 w-8 relative overflow-hidden bg-gray-100 dark:bg-gray-600" data-testid="flowbite-avatar-img">
                      <Image
                        alt=""
                        height={40}
                        src={t.image?.url?`${process.env.BACKEND_URL}${t.image.url}`:`/user.png`}
                        width={40}
                        className="mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                      />
                    </div>
                      <p>{t.name_tc}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    {t.name_en}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    {t.trainee_no}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    {t.gender}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    {t.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    {t.join_date?formatDateToLocal(t.join_date):""}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-white">
                    {t.ehealth_applied?i18n('yes'):i18n('no')}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 text-gray-900 dark:text-white">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice url={`/trainee/${t.documentId}/edit`}  />
                      <DeleteTrainee id={t.documentId} />
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
