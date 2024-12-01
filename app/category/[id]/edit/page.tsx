import {getTranslations} from 'next-intl/server';
import { Breadcrumb, Card,Button,
    Label,
    Select,
    TextInput,
    Textarea,
    ToggleSwitch, } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { HiHome,HiCloudUpload } from "react-icons/hi";
import { fetchCategoryById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { ChgImgBtn } from '@/app/ui/trainee/chgImgBtn';
import {CreateContactBtn} from '@/app/ui/trainee/addContactBtn';
import {DeleteGuardianBtn} from '@/app/ui/trainee/deleteGuardianBtn';
import { updateCategory } from '@/app/lib/actions';

export default async function Page(
    props: { params: Promise<{ id: string }>, searchParams?: Promise<{done?:boolean;}> }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const i18n = await getTranslations('category');
    const id = params.id;
    const done = searchParams?.done || null;
    const [category] = await Promise.all([fetchCategoryById(id)]);

    if (!category) {
        notFound();
    }

    const updateCategoryWithId = updateCategory.bind(null, id);

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
                    <Breadcrumb.Item ><Link href="/category">{i18n('category')}</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{i18n('setting')}</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    {i18n('category')} {i18n('setting')}
                </h1>
            </div>

            <div className="col-span-6 mb-5">
            <div className="grid grid-cols-1 gap-y-4">
            <Card>
                <h3 className="mb-4 text-xl font-bold dark:text-white">
                {i18n('info')}
                </h3>
                <form action={updateCategoryWithId}>
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="namev">{i18n('name')}</Label>
                    <TextInput
                        id="name"
                        name="name"
                        defaultValue={category.name}
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="status">{i18n('status')}</Label>
                    <Select id="status" name="status" defaultValue={category.category_status} >
                        <option key={"T"} value='true'>{i18n('available')}</option>
                        <option key={"F"} value='false'>{i18n('unavailable')}</option>
                    </Select>
                    </div>
                  
                    {done?<div className='text-green-600 dark:text-green-400'>{i18n('success')}</div>:""}
                    <div className="col-span-6 flex">
                        <Button type="submit">{i18n('save')}</Button>
                    </div>
                    
                </div>
                </form>
            </Card>
            </div>
            </div>
            {/* <Form trainee={trainee} customers={customers} /> */}
        </div>
        </main>
    );
}