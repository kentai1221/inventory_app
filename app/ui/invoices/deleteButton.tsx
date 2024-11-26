"use client"
import {
    Button,
    Modal,
  } from "flowbite-react";
import { useState } from "react";
import { deleteInvoice } from '@/app/lib/actions';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    HiOutlineExclamationCircle,
  } from "react-icons/hi";

export function DeleteInvoice({ id }: { id: string }) {
    //const { isOpen, open, close } = useModal();
    const [isOpen, setOpen] = useState(false);
    const deleteInvoiceWithId = deleteInvoice.bind(null, id);

    return (
        <>
            <button onClick={() => setOpen(true)} className="rounded-md border p-2 hover:bg-gray-100 dark:hover:text-black">
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-4" />
            </button>

            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="border-none p-2">
                <span className="sr-only">Delete Invoice</span>
                </Modal.Header>
                <Modal.Body className="px-6 pb-6 pt-0">
                <div className="flex flex-col items-center gap-y-6 text-center">
                    <HiOutlineExclamationCircle className="mx-auto h-20 w-20 text-red-600" />
                    <p className="text-xl font-normal text-gray-500 dark:text-gray-400">
                    Are you sure to delete the invoice?
                    </p>
                    <div className="flex items-center gap-x-3">
                    <form action={deleteInvoiceWithId} className="inline-block">
                    <Button
                        color="failure"
                        theme={{ base: "px-0" }}
                        type="submit"
                    >
                        <span className="text-base font-medium">Delete</span>
                    </Button>
                    </form>
                    <Button
                        color="gray"
                        theme={{ base: "px-0" }}
                        onClick={() => setOpen(false)}
                    >
                        <span className="text-base font-medium">Cancel</span>
                    </Button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
  }
  