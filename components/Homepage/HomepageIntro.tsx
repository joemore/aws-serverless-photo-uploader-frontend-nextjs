import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ArrowRightOnRectangleIcon,
  ArrowUpTrayIcon,
  PencilSquareIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";

const itemsNotSignedIn = [
  {
    name: "Sign In",
    description: "If you have an account, you can sign in here",
    href: "/auth/signin",
    iconColor: "bg-green-500",
    icon: ArrowRightOnRectangleIcon,
  },
  {
    name: "Register Account",
    description: "Register a brand new account here",
    href: "/auth/register",
    iconColor: "bg-orange-500",
    icon: UserPlusIcon,
  },
  {
    name: "Create Backend",
    description: "Need to spin up a new Backend, then view how to do it here",
    href: "#",
    iconColor: "bg-yellow-500",
    icon: PencilSquareIcon,
  },
];

const itemsSignedIn = [
  {
    name: "Profile and Settings",
    description: "View your dashboard here, edit your details in Cognito",
    href: "/auth/profile",
    iconColor: "bg-green-500",
    icon: UserIcon,
  },
  {
    name: "Photo Uploader",
    description: "Upload Photos to S3 and Save in DynamoDB",
    href: "/auth/photo-uploader",
    iconColor: "bg-sky-500",
    icon: ArrowUpTrayIcon,
  },
];

interface PageProps {
  userSignedIn: boolean;
}

export default function HomepageIntro(props: PageProps) {
  const { userSignedIn } = props;
  const items = userSignedIn ? itemsSignedIn : itemsNotSignedIn;
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-lg font-medium text-gray-900">
        Welcome to a Tailwind, NextJS, ServerLess &amp; AWS Project{" "}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        This is a frontend website, built using NextJS 13.0 &amp; Tailwind CSS,
        it uses a backend system built using this{" "}
        <Link
          href="https://github.com/joemore/aws-serverless-photo-uploader"
          className="text-sky-600">
          AWS ServerLess backend
        </Link>
      </p>
      <ul
        role="list"
        className="mt-6 divide-y divide-gray-200 border-t border-b border-gray-200">
        {items.map((item, itemIdx) => (
          <li key={itemIdx}>
            <div className="group relative flex items-start space-x-3 py-4">
              <div className="flex-shrink-0">
                <span
                  className={clsx(
                    item.iconColor,
                    "inline-flex items-center justify-center h-10 w-10 rounded-lg"
                  )}>
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  <a href={item.href}>
                    <span className="absolute inset-0" aria-hidden="true" />
                    {item.name}
                  </a>
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <div className="flex-shrink-0 self-center">
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex">
        <Link
          href="/about"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Read more about this project
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
