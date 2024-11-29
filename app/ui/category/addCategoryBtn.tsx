"use client"
import { FileInput, Label, Button, TextInput, Modal, Table, Select } from "flowbite-react";
import { useEffect,useState } from "react";
import { createCategory, FormState } from '@/app/lib/actions';
import {useTranslations, useLocale} from 'next-intl';
import { useActionState } from 'react';
import { useSession } from "next-auth/react"
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export function CreateCategoryBtn() {
  const { status, data: session } = useSession()
  const { } = session || {};

    const [errors, setErrors] = useState({
        img: false,
      });
    const [openModal, setOpenModal] = useState(false);
    const i18n = useTranslations('category');
    const initialState: FormState = { message: null };
    const [state, formAction, isPending] = useActionState(createCategory, initialState);
    const closeModal = () => {
        setOpenModal(false);
    };
    useEffect(() => {
      if (state && state?.message=='success') {
        closeModal()
      }
    }, [state]); 
    return (
        <div>
            <Modal show={openModal} size="xl" popup onClose={() => setOpenModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6 pb-4">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">{i18n('create')}</h3>
                        <form action={formAction}>
                            <div className="mb-2 block">
                              <Label htmlFor="name" value={i18n('name')} />
                            </div>
                            <TextInput id="name" name="name" />
                            <div className="mt-5 mb-2 block">
                              <Label htmlFor="status" value={i18n('status')} />
                            </div>
                            <Select id="status" name="status" defaultValue={'true'} >
                                <option key={"T"} value='true'>{i18n('available')}</option>
                                <option key={"F"} value='false'>{i18n('unavailable')}</option>
                            </Select>
                            {state?.message=="failed" && <p className="mt-5 text-sm text-red-500">{i18n('err')}</p>}
                            {state?.message=="exist" && <p className="mt-5 text-sm text-red-500">{i18n('exist')}</p>}
                            <Button className="w-full mt-5" type="submit">{isPending?'Loading':`${i18n('save')}`}</Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
            <Button onClick={() => setOpenModal(true)}>{i18n('create')}</Button>
        </div>
    );
  }
  