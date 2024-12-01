import {getTranslations} from 'next-intl/server';
import { Breadcrumb } from "flowbite-react";
import Link from "next/link";
import { HiHome } from "react-icons/hi";
import Form from '@/app/ui/order/edit-form';
import { fetchOrderById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }>, searchParams?: Promise<{done?:boolean;}> }) {
    const i18n = await getTranslations('order');
    const params = await props.params;
    const id = params.id;
    const [order] = await Promise.all([fetchOrderById(id)]);
    if (!order) {
        notFound();
    }
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
                    <Breadcrumb.Item>{i18n('order')} {i18n('setting')}</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    {i18n('order')} {i18n('setting')}
                </h1>
            </div>

            <Form id={id} order={order} />
        </div>
        </main>
    );
}