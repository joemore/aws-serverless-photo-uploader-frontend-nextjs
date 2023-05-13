import { Fragment, useEffect } from "react";

import { Popover, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UserIcon as UserIconSolid } from "@heroicons/react/24/solid";
import { Auth } from "aws-amplify";
import Link from "next/link";
import { useRouter } from "next/router";
import { GiHotDog, GiMonkey } from "react-icons/gi";
import { LoginState, useStateValue } from "../../context/state";
import MenuDropDown from "./MenuDropDown";

export default function MainNav() {
  const navigation = [
    { name: "Home", href: "/" },
    {
      name: "About",
      href: "https://www.joemore.com/photo-uploader-with-aws-serverless-nextjs-and-tailwind/",
    },
  ];

  const router = useRouter();

  const [{ loginState, user }, dispatch] = useStateValue();

  const getUserDetails = async () => {
    const user = await Auth.currentAuthenticatedUser();
    dispatch({
      type: "setUser",
      user: user.attributes,
    });
  };

  const signOut = async () => {
    await Auth.signOut();
    dispatch({
      type: "setLoginState",
      loginState: LoginState.NotSignedIn,
    });
    dispatch({
      type: "setUser",
      user: null,
    });
    router.replace("/auth/signin");
  };

  useEffect(() => {
    getUserDetails();
  }, [loginState]);

  const userNavigation = [
    ...(loginState !== LoginState.SignedIn
      ? [
          { name: "Sign in", href: "/auth/signin" },
          { name: "Register", href: "/auth/register" },
        ]
      : [
          {
            key: "profile",
            name: (
              <div>
                <span>
                  {" "}
                  <UserIcon className="w-6 h-6 inline mr-1" />
                  <span className="ml-2">{user?.email} </span>
                </span>
              </div>
            ),
            href: "/auth/profile",
          },
          {
            key: "signout",
            name: (
              <span>
                {" "}
                <ArrowRightOnRectangleIcon className="w-6 h-6 inline mr-1" />
                <span className="ml-2">Sign out</span>
              </span>
            ),
            href: "#signout",
            onClick: signOut,
          },
        ]),
  ];

  return (
    <Popover as="header" className="relative">
      {({ open, close }) => (
        <>
          <div className="bg-gradient-to-r from-stone-800 to-stone-600 p-6">
            <nav
              className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
              aria-label="Global">
              <div className="flex items-center flex-1">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <Link href="/">
                    <span className="sr-only">PhotoWhale</span>
                    <GiMonkey className="text-5xl text-pink-500" />
                  </Link>

                  {/* Mobile Menu Open */}
                  <div className="-mr-2 flex items-center md:hidden">
                    <Popover.Button className="bg-stone-700 rounded-md p-2 inline-flex items-center justify-center text-gray-100 hover:bg-stone-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="hidden space-x-8 md:flex md:ml-10">
                  {navigation.map((item) => (
                    <Link
                      href={item.href}
                      key={item.name}
                      className="text-base font-medium text-white hover:text-gray-300">
                      {item.name}
                    </Link>
                  ))}

                  {/* Profile dropdown */}
                  {/* <MenuDropDown linksList={layoutsPages}>
                                    <span className="text-base font-medium text-white hover:text-gray-300">Layouts</span>
                                </MenuDropDown> */}
                </div>
              </div>
              <div className="hidden md:flex md:items-center md:space-x-6">
                {/* Profile dropdown (Desktop on the right) */}
                <MenuDropDown linksList={userNavigation}>
                  <div className="bg-white rounded-full flex p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500">
                    <span className="sr-only">Open user menu</span>
                    <span className="user-photo">
                      {!!user?.picture ? (
                        <img src={user?.picture} className="w-10 h-10" />
                      ) : !!user ? (
                        <UserIconSolid
                          className="h-10 w-10"
                          aria-hidden="true"
                        />
                      ) : (
                        <UserIcon className="h-10 w-10" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                </MenuDropDown>
              </div>
            </nav>
          </div>

          <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <Popover.Panel
              focus
              className="absolute top-0 inset-x-0 p-2 transition transform origin-top md:hidden z-10">
              <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div className="text-gray-500">Photo Uploader</div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-600">
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="pt-5 pb-6">
                  <div className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                        {item.name}
                      </Link>
                    ))}
                    {/* layoutsPages */}
                    {/* {layoutsPages.map((item : any, index : number) => {
                                        return (
                                            <Link key={index}
                                                href={item.href}
                                                onClick={ () => close() }
                                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                                                    target={item.target || ''}>
                                                
                                                    {item.name} 
                                                    {item.target && <ArrowTopRightOnSquareIcon className='h-4 w-4 inline text-blue-500 ml-2 -mt-1' />}
                                               
                                            </Link>
                                        )
                                    })} */}

                    <div className="border-b border-gray-200 mx-4"></div>
                    {/* Mobile Profile Stuff */}
                    {userNavigation.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={
                          item.onClick ? () => item.onClick() : () => null
                        }
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
