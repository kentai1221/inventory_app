import {getTranslations} from 'next-intl/server';
import { Breadcrumb } from "flowbite-react";
import Link from "next/link";
import { HiHome } from "react-icons/hi";
import Form from '@/app/ui/order/create-form';
import { fetchProducts } from '@/app/lib/data';

export default async function Page() {
    const i18n = await getTranslations('order');
    const [products] = await Promise.all([fetchProducts()]);
    
    return (
        <main>
        <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
            <div className="col-span-full mb-4 xl:mb-2">
                <Breadcrumb className="mb-5">
                    <Breadcrumb.Item>
                        <div className="flex items-center gap-x-3">
                        <HiHome className="text-xl" />
                        <Link href="/"><span className="dark:text-white">{i18n('main')}</span></Link>
                        </div>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item ><Link href="/order">{i18n('order')}</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{i18n('setting')}</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    {i18n('order')} {i18n('setting')}
                </h1>
            </div>

            <Form products={products} />
        </div>
        </main>
    );
}