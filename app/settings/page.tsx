import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import Link from "next/link";
import ChangePwd from '../ui/changePwd'; 
export default async function Page() {

    const i18n = await getTranslations('settings');

    return (
        <>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-1 w-full">
            <div className="mb-4">
                <Breadcrumb className="mb-5">
                <Breadcrumb.Item>
                    <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <Link href="/">
                        <span className="dark:text-white">{i18n('main')}</span>
                    </Link>
                    </div>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{i18n('setting')}</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {i18n('setting')}
                </h1>
            </div>
            </div>
        </div>
        <div className="sm:flex">
            <ChangePwd />
        </div>
        </>

    );
}