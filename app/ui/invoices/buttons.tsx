import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
  HiPlus,
  HiDocumentDownload,
} from "react-icons/hi";
import {
  Button,
} from "flowbite-react";

export function CreateInvoice() {
  return (
    <Button
      href="/invoices/create"
      className="p-0 bg-cyan-600 dark:bg-cyan-700 hover:bg-cyan-700 hover:dark:bg-cyan-600"
    >
      <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          新增發票
      </div>
    </Button>
  );
}

export function ExportInvoice() {
  return (
    <Button
      href="/invoices/export"
      className="p-0 bg-gray-400 dark:bg-gray-700 hover:bg-gray-500 hover:dark:bg-gray-600"
    >
      <div className="flex items-center gap-x-3">
        <HiDocumentDownload className="text-xl" />
        <span>匯出 Excel</span>
      </div>
    </Button>
  );
}


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