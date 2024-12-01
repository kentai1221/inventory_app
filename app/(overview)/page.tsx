import FirstApexChart from '@/app/ui/dashboard/firstApexChart';
import SecondApexChart from '@/app/ui/dashboard/secondApexChart';
import ThridApexChart from '@/app/ui/dashboard/thridApexChart';
import FourthApexChart from '@/app/ui/dashboard/fourthApexChart';

import {getTranslations} from 'next-intl/server';

import { fetchData } from '../lib/data';

export default async function Page() {
  const i18n = await getTranslations('mainpage');

  const [data] = await Promise.all([fetchData()]);

  return (
    <div className="px-4 pt-6">
      <div className="my-4 grid grid-cols-1 xl:gap-4 2xl:grid-cols-3">
      <FirstApexChart data={data.monthlyTotals} />
      </div>
      
      <div className="my-4 grid grid-cols-1 xl:gap-4 2xl:grid-cols-3">
        <SecondApexChart data={data.monthlyPayment} />
        <ThridApexChart data={data.monthlyOrders} />
        <FourthApexChart data={data.inventory} />
      </div> 
    </div>
  );
}

