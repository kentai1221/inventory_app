import Link from 'next/link';
import {
  HiPlus,
  HiDocumentDownload,
} from "react-icons/hi";
import {
  Button,
} from "flowbite-react";
import { PencilIcon } from '@heroicons/react/24/outline';

export function CreateButton({ url, text }: {url:string, text:string}) {
  return (
    <Button
      href={url}
      className="p-0 bg-cyan-600 dark:bg-cyan-700 hover:bg-cyan-700 hover:dark:bg-cyan-600"
    >
      <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          {text}
      </div>
    </Button>
  );
}

export function ExportButton({ url, text }: {url:string, text:string}) {
  return (
    <Button
      href={url}
      className="p-0 bg-gray-400 dark:bg-gray-700 hover:bg-gray-500 hover:dark:bg-gray-600"
    >
      <div className="flex items-center gap-x-3">
        <HiDocumentDownload className="text-xl" />
        <span>{text}</span>
      </div>
    </Button>
  );
}

export function UpdateInvoice({ url }: { url: string }) {
  return (
    <Link
      href={url}
      className="rounded-md border p-2 hover:bg-gray-100 dark:hover:text-black"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}