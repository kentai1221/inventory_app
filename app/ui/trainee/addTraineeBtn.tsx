"use client"
import { FileInput, Label, Button, TextInput, Modal, Table, Select } from "flowbite-react";
import { useEffect,useState } from "react";
import { createTrainee, FormState } from '@/app/lib/actions';
import {useTranslations, useLocale} from 'next-intl';
import { useActionState } from 'react';
import { useSession } from "next-auth/react"
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export function CreateTraineeBtn() {
  const { status, data: session } = useSession()
  const { } = session || {};

    const [errors, setErrors] = useState({
        img: false,
      });
    const [openModal, setOpenModal] = useState(false);
    const i18n = useTranslations('trainee');
    const initialState: FormState = { message: null };
    const [state, formAction, isPending] = useActionState(createTrainee, initialState);
    const locale = useLocale();
    const pathname = usePathname();
    const { replace } = useRouter();
    const closeModal = () => {
        setOpenModal(false);
    };
    useEffect(() => {
      if (state && state?.message=='success') {
        replace(`${pathname}/${state?.payload?.get("tid")}/edit`);
        //closeModal()
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
                              <Label htmlFor="branch" value={i18n('branch')} />
                            </div>

                            <Select className="mb-5" id="branch" name="branch" defaultValue={session?.user?.branches[0].documentId}>
                            {
                                session?.user?.branches?.map((b) => (
                                  <option key={b.documentId} value={b.documentId}>{locale=="en"?b.name_en:b.name}</option>
                              ))
                            }
                            </Select>

                            <div className="mb-2 block">
                              <Label htmlFor="trainee_no" value={i18n('trainee_no')} />
                            </div>
                            <TextInput id="trainee_no" name="trainee_no" />
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
  