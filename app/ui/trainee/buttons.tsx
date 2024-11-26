import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
  HiPlus,
  HiDocumentDownload,
} from "react-icons/hi";
import {
  Button,
} from "flowbite-react";


export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 dark:hover:text-black"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}