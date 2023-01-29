/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";
import { GoAlert } from "react-icons/go";

export default function Modal(props: any) {
  const { open, setOpen, type, title, body, closeButtonText } = props;
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  {type === "success" && (
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  {type === "error" && (
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                      <GoAlert
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{body}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className={clsx(
                      type === "success"
                        ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                        : type === "warning"
                        ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                        : type === "error"
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        : //Default:
                          "bg-stone-600 hover:bg-stone-700 focus:ring-stone-500",
                      `inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2  
                        text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`
                    )}
                    onClick={() => setOpen(false)}>
                    {closeButtonText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
