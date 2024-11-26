import { useCallback, useState } from "react";
import CloseIcon from "./CloseIcon";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  title: string;
  content: string;
  close: () => void;
};

export const Modal = ({ children, isOpen, close, title, content }: Props) => {
  const modal = isOpen && (
    <div
      className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-black bg-opacity-50"
      id="confirm-modal"
      tabIndex={-1}
      aria-labelledby="modal-title"
      aria-hidden="true"
    >
      <div className="pointer-events-none relative w-auto opacity-100 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:my-7 min-[576px]:max-w-[500px]">
        <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none">
          <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4">
            <h5
              className="text-xl font-medium leading-normal text-neutral-800"
              id="modal-title"
            >
              {title}
            </h5>
            <button
              type="button"
              className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              data-te-modal-dismiss
              aria-label="Close"
              onClick={() => close()}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="relative flex-auto p-4" data-te-modal-body-ref>
            {content}
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return modal;
};

export const useModal = () => {
  const [isOpen, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const open = useCallback(() => setOpen(true), []);

  return { isOpen, open, close };
};