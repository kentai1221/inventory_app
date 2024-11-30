"use client"
import { Label, Button, TextInput, Select } from "flowbite-react";
import { useState } from "react";
import { updateProduct, FormState } from '@/app/lib/actions';
import {useTranslations} from 'next-intl';
import { useActionState, useEffect } from 'react';
import { Product, Brand, Category } from '@/app/lib/definitions';

export  function EditProductForm({ id, product, brands, categories }: { id: string, product:Product, brands:any, categories:any }) {
    const i18n = useTranslations('product');
    const initialState: FormState = { message: null };
    const [state, formAction, isPending] = useActionState(updateProduct, initialState);
    const [reRender, setReRender] = useState(0);
    useEffect(() => {setReRender(reRender+1)}, [state]);
    
    return ( 
        <form action={formAction} className="block">
            <TextInput
                id="id"
                name="id"
                type="hidden"
                defaultValue={id}
            />
            <div className="grid gap-6">
                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-6">
                <Label htmlFor="name">{i18n('name')}</Label>
                <TextInput
                    id="name"
                    name="name"
                    defaultValue={state.payload?.get("name") as string || product.name}
                />
                </div>

                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="quantity">{i18n('quantity')}</Label>
                <TextInput
                    id="quantity"
                    name="quantity"
                    defaultValue={state.payload?.get("quantity") as string || product.quantity}
                />
                </div>

                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="price">{i18n('price')}</Label>
                <TextInput
                    id="price"
                    name="price"
                    defaultValue={state.payload?.get("price") as string || product.price}
                />
                </div>

                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="brand">{i18n('brand')}</Label>
                    <Select key={reRender} id="brand" name="brand" defaultValue={state.payload?.get("brand") as string ||product.brand?.documentId} >
                        <option key="" value=""></option>
                        {brands?.map((b:Brand) => (
                            <option key={b.documentId} value={b.documentId}>{b.name}</option>
                        ))}
                    </Select>
                </div>

                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="category">{i18n('category')}</Label>
                    <Select  key={reRender} id="category" name="category" defaultValue={state.payload?.get("category") as string ||product.category?.documentId} >
                        <option key="" value=""></option>
                        {categories?.map((c:Category) => (
                            <option key={c.documentId} value={c.documentId}>{c.name}</option>
                        ))}
                    </Select>
                </div>

                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="code">{i18n('code')}</Label>
                <TextInput
                    id="code"
                    name="code"
                    defaultValue={state.payload?.get("code") as string || product.code}
                />
                </div>

                <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                <Label htmlFor="status">{i18n('status')}</Label>
                <Select key={reRender} id="status" name="status" defaultValue={state.payload?.get("status") as string || product.product_status==false?"false":"true"} >
                    <option key={"T"} value='true'>{i18n('available')}</option>
                    <option key={"F"} value='false'>{i18n('unavailable')}</option>
                </Select>
                </div>

                {state?.message=="failed" && <p className="mt-5 text-sm text-red-500">{i18n('err')}</p>}
                {state?.message=="success" && <p className="mt-5 text-sm text-green-600 dark:text-green-400">{i18n('success')}</p>}
                <div className="col-span-6 flex">
                    <Button type="submit">{isPending?"Loading":i18n('save')}</Button>
                </div>
            </div>
        </form>
    );
  }
  