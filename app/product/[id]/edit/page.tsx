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
import { fetchProductById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { ChgImgBtn } from '@/app/ui/product/chgImgBtn';
import {CreateContactBtn} from '@/app/ui/trainee/addContactBtn';
import {DeleteGuardianBtn} from '@/app/ui/trainee/deleteGuardianBtn';
import { updateProduct } from '@/app/lib/actions';

export default async function Page(
    props: { params: Promise<{ id: string }>, searchParams?: Promise<{done?:boolean;}> }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const i18n = await getTranslations('product');
    const id = params.id;
    const done = searchParams?.done || null;
    const [product] = await Promise.all([fetchProductById(id)]);

    if (!product) {
        notFound();
    }

    const updateProductWithId = updateProduct.bind(null, id);

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
                    <Breadcrumb.Item ><Link href="/product">{i18n('product')}</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{i18n('setting')}</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    {i18n('product')} {i18n('setting')}
                </h1>
            </div>

            <div className="col-span-full mb-4 xl:col-auto xl:mb-0">
                <div className="grid grid-cols-1 gap-y-4">
                    <Card>
                        <div className="items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4">
                            <Image
                                alt=""
                                height={200}
                                src={product.image?.url?`${process.env.BACKEND_URL}${product.image.url}`:`/user.png`}
                                width={200}
                                className="mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                            />
                            <div>
                                <h3 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
                                {product.name}
                                </h3>
                                <ChgImgBtn id={id} />
                            </div>
                        </div>
                    </Card>   

                    <Card>
                        <div className="flow-root">
                        <h3 className="text-xl mb-6 font-bold dark:text-white">{i18n('guardian')}</h3>
                        <ul className="mb-6 divide-y divide-gray-200 dark:divide-gray-700">
                        {product.guardians?.map((guardian:any) => (
                            <li key={guardian.id} className="pb-3 last:pb-3">
                                <div className="flex justify-between xl:block 2xl:flex 2xl:space-x-4">
                                <div className="flex space-x-4 xl:mb-4 2xl:mb-0">
                                
                                    <div className="min-w-0 flex-1">
                                        <p className="mt-2 mb-2 truncate text-base font-semibold leading-none text-gray-900 dark:text-white">
                                            {/* {trainee.customer.name} */}{guardian.name}{` (${guardian.relationship})`}
                                        </p>
                                        <p className="mb-2 truncate text-sm font-normal text-primary-700 dark:text-primary-500">
                                            {/* {trainee.customer.name_en} */}{guardian.phone}
                                        </p>
                                    </div>
                                
                                </div>
                                <div className="inline-flex w-auto items-center xl:w-full 2xl:w-auto">
                                    <DeleteGuardianBtn id={id} gid={guardian.documentId}/>
                                </div>
                                </div>
                            </li>
                        ))}
                        </ul>
                            <div className="col-span-6 flex">
                            <CreateContactBtn id={id} />
                            </div>
                        </div>
                    </Card>      
                </div>
            </div>
            <div className="col-span-2 mb-5">
                <div className="grid grid-cols-1 gap-y-4">
                    <Card>
                        <h3 className="mb-4 text-xl font-bold dark:text-white">
                        {i18n('info')}
                        </h3>
                        <form action={updateProductWithId}>
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                            <Label htmlFor="namev">{i18n('name')}</Label>
                            <TextInput
                                id="name"
                                name="name"
                                defaultValue={product.name}
                            />
                            </div>
                            <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                            <Label htmlFor="status">{i18n('status')}</Label>
                            <Select id="status" name="status" defaultValue={product.product_status} >
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