
import {getTranslations} from 'next-intl/server';
import { Breadcrumb, Card,Button,
    Label,
    Select,
    TextInput
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { HiHome } from "react-icons/hi";
import { fetchProductById, fetchCategories, fetchBrands } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { ChgImgBtn } from '@/app/ui/product/chgImgBtn';
import { EditProductForm } from '@/app/ui/product/editProductForm';

export default async function Page(
    props: { params: Promise<{ id: string }>, searchParams?: Promise<{done?:boolean;}> }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const i18n = await getTranslations('product');
    const id = params.id;
    const done = searchParams?.done || null;
    const [product, brands, categories] = await Promise.all([fetchProductById(id), fetchBrands(), fetchCategories()]);

    if (!product) {
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
                            <div
                                className='mb-3 sm:mb-0'
                                style={{
                                    display: 'grid',
                                    gridGap: '8px',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 200px))',
                                }}
                                >
                                <div style={{ position: 'relative', height: '200px' }}>
                                    <Image
                                    alt={product.name}
                                    src={product.image?.[0]?.url?`${process.env.BACKEND_URL}${product.image[0]?.url}`:`/product.png`}
                                    fill
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
                                {product.name}
                                </h3>
                                <ChgImgBtn id={id} />
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
                        <EditProductForm id={id} product={product} brands={brands} categories={categories} />
                    </Card>
                </div>
            </div>
        </div>
        </main>
    );
}