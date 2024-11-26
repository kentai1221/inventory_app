import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import FirstApexChart from '@/app/ui/dashboard/firstApexChart';
import SecondApexChart from '@/app/ui/dashboard/secondApexChart';
import ThridApexChart from '@/app/ui/dashboard/thridApexChart';
import FourthApexChart from '@/app/ui/dashboard/fourthApexChart';

import {getTranslations} from 'next-intl/server';

import { fetchLatestInvoices,fetchTotalPaidInvoices,fetchTotalPendingInvoices,fetchNumOfInvoices,fetchNumOfCustomer } from '../lib/data';

export default async function Page() {
  const i18n = await getTranslations('mainpage');

  // const [latestInvoices] = await Promise.all([
  //   fetchLatestInvoices()
  // ]);

  return (
    // <main>
    //   <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
    //     Dashboard
    //   </h1>
    //   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    //     <Card title="Collected" value={formatCurrency(totalPaidInvoices)} type="collected" />
    //     <Card title="Pending" value={formatCurrency(totalPendingInvoices)} type="pending" />
    //     <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
    //     <Card title="Total Customers" value={numberOfCustomers} type="customers" />
    //   </div>
    //   <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
    //     <Suspense fallback={<RevenueChartSkeleton />}>
    //       <RevenueChart />
    //     </Suspense>
    //     <LatestInvoices latestInvoices={latestInvoices} />
    //   </div>
    //   <DemoForms />
    // </main>

    <div className="px-4 pt-6">
      <div className="my-4 grid grid-cols-1 xl:gap-4 2xl:grid-cols-3">
      <FirstApexChart />
      {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
      
      <div className="my-4 grid grid-cols-1 xl:gap-4 2xl:grid-cols-3">
        {/* <LatestInvoices latestInvoices={latestInvoices} />
        <LatestInvoices latestInvoices={latestInvoices} />
        <LatestInvoices latestInvoices={latestInvoices} /> */}
        <SecondApexChart />
        <ThridApexChart />
        <FourthApexChart />
      </div> 
      {/* <Card title="Collected" value={formatCurrency(totalPaidInvoices)} type="collected" />
      <Card title="Pending" value={formatCurrency(totalPendingInvoices)} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card title="Total Customers" value={numberOfCustomers} type="customers" /> */}
      {/* <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
      </div>
      <div className="my-4 grid grid-cols-1 xl:gap-4 2xl:grid-cols-3">
          <LatestInvoices latestInvoices={latestInvoices} />
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-1">
          <DemoForms />
        </div>
      </div> */}
      
    </div>
  );
}

