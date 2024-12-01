"use client"
import {useTranslations} from 'next-intl';
import {
    Button,
    Modal,
  } from "flowbite-react";
import { useState } from "react";
import { deleteBrand } from '@/app/lib/actions';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    HiOutlineExclamationCircle,
  } from "react-icons/hi";

export function DeleteBrand({ id }: { id: string }) {
    //const { isOpen, open, close } = useModal();
    const [isOpen, setOpen] = useState(false);
    const deleteBrandWithId = deleteBrand.bind(null, id);
    const i18n = useTranslations('brand');
    
    return (
        <>
            <button onClick={() => setOpen(true)} className="rounded-md border p-2 hover:bg-gray-100 dark:hover:text-black">
            <span className="sr-only">{i18n('del_brand')}</span>
            <TrashIcon className="w-5" />
            </button>

            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="border-none p-2">
                <span className="sr-only">{i18n('del_brand')}</span>
                </Modal.Header>
                <Modal.Body className="px-6 pb-6 pt-0">
                <div className="flex flex-col items-center gap-y-6 text-center">
                    <HiOutlineExclamationCircle className="mx-auto h-20 w-20 text-red-600" />
                    <p className="text-xl font-normal text-gray-500 dark:text-gray-400">
                    {i18n('del_brand_msg')}
                    </p>
                    <div className="flex items-center gap-x-3">
                    <form action={deleteBrandWithId} className="inline-block">
                    <Button
                        color="failure"
                        theme={{ base: "px-0" }}
                        type="submit"
                    >
                        <span className="text-base font-medium"> {i18n('del')}</span>
                    </Button>
                    </form>
                    <Button
                        color="gray"
                        theme={{ base: "px-0" }}
                        onClick={() => setOpen(false)}
                    >
                        <span className="text-base font-medium"> {i18n('cancel')}</span>
                    </Button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
  }
  