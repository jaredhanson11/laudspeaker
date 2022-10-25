import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface IModalProps {
  isOpen: boolean;
  title?: JSX.Element;
  children?: JSX.Element;
  titleClass?: string;
  childrenClass?: string;
  panelClass?: string;
  closeButtonNeed?: boolean;
  onClose?: () => void;
}

const Modal = ({
  isOpen,
  onClose = () => null,
  children,
  title,
  childrenClass = "",
  panelClass = "",
  titleClass = "",
  closeButtonNeed = true,
}: IModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`${panelClass} w-full max-w-md transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh]`}
              >
                {title && (
                  <Dialog.Title className={titleClass}>{title}</Dialog.Title>
                )}
                <div className="mt-2 pr-[10px]">
                  <Dialog.Description
                    className={`${childrenClass} max-h-[80vh] overflow-visible pr-[10px]`}
                  >
                    {children}
                  </Dialog.Description>
                </div>
                {closeButtonNeed && (
                  <button
                    className="absolute top-[10px] right-[20px] border-0 bg-transparent outline-none text-[24px] cursor-pointer"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-[30px] w-[30px]" />
                  </button>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
