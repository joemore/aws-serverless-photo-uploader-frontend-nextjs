/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function MenuDropDown({ children, ...props }: any) {
  const { linksList } = props;
  return (
    <Menu as="div" className="ml-4 relative flex-shrink-0">
      <div>
        <Menu.Button>{children}</Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="origin-top-right absolute z-20 right-0 mt-2 min-w-fit w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          {linksList &&
            linksList.map((item: any, index: number) => (
              <Menu.Item key={item.key || item.name}>
                {({ active }) => (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className={clsx(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                    target={item.target || ""}>
                    {item.name}
                    {item.target && (
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 inline text-blue-500 ml-2 -mt-1" />
                    )}
                  </a>
                )}
              </Menu.Item>
            ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
