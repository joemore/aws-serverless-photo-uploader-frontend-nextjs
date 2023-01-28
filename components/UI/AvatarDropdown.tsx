/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon as SelectorIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";

const people = [
  {
    id: 1,
    name: "Default Dude",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-01-svgrepo-com-cropped.svg",
  },
  {
    id: 2,
    name: "Beardy McBeardface",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-02-svgrepo-com-cropped.svg",
  },
  {
    id: 3,
    name: "Darth Maul",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-03-svgrepo-com-cropped.svg",
  },
  {
    id: 4,
    name: "Chic Girl",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-04-svgrepo-com-cropped.svg",
  },
  {
    id: 5,
    name: "Old Lady",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-05-svgrepo-com-cropped.svg",
  },
  {
    id: 6,
    name: "Apprentice",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-06-svgrepo-com-cropped.svg",
  },
  {
    id: 7,
    name: "Vintage Man",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-07-svgrepo-com-cropped.svg",
  },
  {
    id: 8,
    name: "Hipster Harry",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-08-svgrepo-com-cropped.svg",
  },
  {
    id: 9,
    name: "Nerdy Dude",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-09-svgrepo-com-cropped.svg",
  },
  {
    id: 10,
    name: "Office Girl",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-10-svgrepo-com-cropped.svg",
  },
  {
    id: 11,
    name: "Business Bobby",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-11-svgrepo-com-cropped.svg",
  },
  {
    id: 12,
    name: "Cool Dave",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-12-svgrepo-com-cropped.svg",
  },
  {
    id: 13,
    name: "Tobi Won",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-13-svgrepo-com-cropped.svg",
  },
  {
    id: 14,
    name: "Office Lady",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-14-svgrepo-com-cropped.svg",
  },
  {
    id: 15,
    name: "Sporty Spice",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-15-svgrepo-com-cropped.svg",
  },
  {
    id: 16,
    name: "Old Man",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-16-svgrepo-com-cropped.svg",
  },
];

interface PagePropsExpected {
  label: string;
  currentAvatar: number;
  onChangeAvatar: Function;
}

export default function AvatarDropdown(props: PagePropsExpected) {
  const { currentAvatar, onChangeAvatar, label } = props;

  const selectedIndex = people.findIndex((x) => x.id === currentAvatar);
  const [selected, setSelected] = useState(
    people[selectedIndex < 0 ? 0 : selectedIndex]
  );

  const onChangeHandler = function (e: any) {
    setSelected(e);
    if (typeof onChangeAvatar === "function") {
      onChangeAvatar(e);
    } else {
      console.warn("onChangeAvatar is not a function");
    }
  };

  return (
    <Listbox value={selected} onChange={onChangeHandler}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-400">
            {label}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="flex items-center">
                <img
                  src={selected?.avatar}
                  alt=""
                  className="flex-shrink-0 h-6 w-6 rounded-full"
                />
                <span className="ml-3 block truncate">{selected?.name}</span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {people.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      clsx(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={person}>
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <img
                            src={person.avatar}
                            alt=""
                            className="flex-shrink-0 h-6 w-6 rounded-full"
                          />
                          <span
                            className={clsx(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}>
                            {person.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
