"use client"
import {
    Button,
    Modal,
    TextInput,
  } from "flowbite-react";
import { useState, useActionState } from "react";
import { deleteGuardian, FormState } from '@/app/lib/actions';
import {useTranslations} from 'next-intl';
import {
    HiOutlineExclamationCircle,
  } from "react-icons/hi";

export function DeleteGuardianBtn({ id, gid }: { id: string, gid: string }) {
    const i18n = useTranslations('trainee');
    const initialState: FormState = { message: null };
    const [isOpen, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(deleteGuardian, initialState);

    return (
        <>
            <Button onClick={() => setOpen(true)} size="sm" color="gray" href="#" className="w-full">
                {i18n('remove')}
            </Button>

            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="border-none p-2">
                <span className="sr-only">{i18n('del_gurdian')}</span>
                </Modal.Header>
                <Modal.Body className="px-6 pb-6 pt-0">
                <div className="flex flex-col items-center gap-y-6 text-center">
                    <HiOutlineExclamationCircle className="mx-auto h-20 w-20 text-red-600" />
                    <p className="text-xl font-normal text-gray-500 dark:text-gray-400">
                    {i18n('del_gurdian_msg')}
                    </p>
                    <div className="flex items-center gap-x-3">
                    <form action={formAction} className="inline-block">
                    <TextInput
                        id="id"
                        name="id"
                        type="hidden"
                        defaultValue={id}
                    />
                    <TextInput
                        id="gid"
                        name="gid"
                        type="hidden"
                        defaultValue={gid}
                    />
                    <Button
                        color="failure"
                        theme={{ base: "px-0" }}
                        type="submit"
                    >
                        <span className="text-base font-medium">{i18n('del')}</span>
                    </Button>
                    </form>
                    <Button
                        color="gray"
                        theme={{ base: "px-0" }}
                        onClick={() => setOpen(false)}
                    >
                        <span className="text-base font-medium">{i18n('cancel')}</span>
                    </Button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
  }
  