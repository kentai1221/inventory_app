"use client"
import { FileInput, Label, Button, TextInput, Modal, Table } from "flowbite-react";
import { useEffect,useState } from "react";
import { createGuardian, FormState } from '@/app/lib/actions';
import {useTranslations} from 'next-intl';
import { useActionState } from 'react';

export function CreateContactBtn({ id }: { id: string }) {
    const [errors, setErrors] = useState({
        img: false,
      });
    const [openModal, setOpenModal] = useState(false);
    const i18n = useTranslations('trainee');
    const initialState: FormState = { message: null };
    const [state, formAction, isPending] = useActionState(createGuardian, initialState);
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
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">{i18n('guardian')}</h3>
                        <form action={formAction}>
                            <TextInput
                                id="id"
                                name="id"
                                type="hidden"
                                defaultValue={id}
                            />
                            <div className="mb-2 block">
                              <Label htmlFor="gname" value={i18n('gname')} />
                            </div>
                            <TextInput id="gname" name="gname" />
                            <div className="mt-2 mb-2 block">
                              <Label htmlFor="phone" value={i18n('phone')} />
                            </div>
                            <TextInput id="phone" name="phone" />
                            <div className="mt-2 mb-2 block">
                              <Label htmlFor="relationship" value={i18n('relationship')} />
                            </div>
                            <TextInput id="relationship" name="relationship" />
                            {state?.message=="failed" && <p className="mt-5 text-sm text-red-500">{i18n('err')}</p>}
                            <Button className="w-full mt-5" type="submit">{isPending?'Loading':`${i18n('save')}`}</Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
            <Button onClick={() => setOpenModal(true)}>{i18n('create_contact')}</Button>
        </div>
    );
  }
  