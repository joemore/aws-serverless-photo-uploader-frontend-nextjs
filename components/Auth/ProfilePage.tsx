import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { Auth } from "aws-amplify";

interface IUser {
  name: string;
  email: string;
  email_verified: boolean;
  imageUrl?: string;
  sub?: string;
}

const disabledInput =
  "mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm bg-gray-100 sm:text-sm font-mono text-sm text-gray-400";

export default function ProfilePage() {
  const defaultUser: IUser = {
    name: "",
    email: "",
    email_verified: false,
    imageUrl: "/generic-profile-photo.jpg",
  };

  const [user, setUser] = useState<IUser>(defaultUser);

  // Get the users details from AWS amplify/cognito
  const getUserDetails = async () => {
    const deets = await Auth.currentAuthenticatedUser();
    const newUserDetails: IUser = {
      imageUrl: deets.attributes.picture || "/generic-profile-photo.jpg",
      name: deets.attributes.name,
      email: deets.attributes.email,
      email_verified: deets.attributes.email_verified,
      sub: deets.attributes.sub,
    };
    setUser(newUserDetails);
  };

  // Currently only handling the change for the users fullname
  const handleFullNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "fullname") {
      setUser({ ...user, name: value });
      console.log("Users name has been Updated to be: ", value);
    }
  };

  // Save form data to AWS amplify/cognito
  const saveDetails = async () => {
    const userFromAWS = await Auth.currentAuthenticatedUser();
    const updatedUser = await Auth.updateUserAttributes(userFromAWS, {
      name: user.name,
    });
    console.log("updatedUser", updatedUser);
  };

  // Override Photo Change
  const handlePhotoChange = (e: any) => {
    e.preventDefault();
    alert(
      "This is a demo. You can't change your photo, but feel free to update the code so that you can!"
    );
    return;
  };

  // Get users details at startup
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div>
      <Disclosure
        as="div"
        className="relative overflow-hidden bg-stone-700 pb-32">
        {({ open }) => (
          <>
            <div
              aria-hidden="true"
              className={clsx(
                open ? "bottom-0" : "inset-y-0",
                "absolute inset-x-0 left-1/2 w-full -translate-x-1/2 transform overflow-hidden lg:inset-y-0"
              )}>
              <div className="absolute inset-0 flex">
                <div
                  className="h-full w-1/2"
                  style={{ backgroundColor: "#292524" }}
                />
                <div
                  className="h-full w-1/2"
                  style={{ backgroundColor: "#44403c" }}
                />
              </div>
              <div className="relative flex justify-center">
                <svg
                  className="flex-shrink-0"
                  width={1750}
                  height={308}
                  viewBox="0 0 1750 308"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M284.161 308H1465.84L875.001 182.413 284.161 308z"
                    fill="#57534e"
                  />
                  <path
                    d="M1465.84 308L16.816 0H1750v308h-284.16z"
                    fill="#57534e"
                  />
                  <path
                    d="M1733.19 0L284.161 308H0V0h1733.19z"
                    fill="#292524"
                  />
                  <path
                    d="M875.001 182.413L1733.19 0H16.816l858.185 182.413z"
                    fill="#44403c"
                  />
                </svg>
              </div>
            </div>
            <header className="relative py-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Profile &amp; Account Settings
                </h1>
              </div>
            </header>
          </>
        )}
      </Disclosure>

      <main className="relative -mt-32">
        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
              <form
                className="divide-y divide-gray-200 lg:col-span-12"
                action="#"
                method="POST">
                {/* Profile section */}
                <div className="py-6 px-4 sm:p-6 lg:pb-8">
                  <div>
                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                      Profile
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      In this basic demo, you can currently only change your
                      name... this is updated into the Cognito user pool itself.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col lg:flex-row">
                    <div className="flex-grow space-y-6">
                      <div>
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                            website.com/
                          </span>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            className={clsx(
                              "block w-full min-w-0 flex-grow rounded-none rounded-r-md border-gray-300 bg-gray-100 sm:text-sm"
                            )}
                            readOnly
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="about"
                          className="block text-sm font-medium text-gray-700">
                          About
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="about"
                            name="about"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
                            readOnly
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Brief description for your profile. URLs are
                          hyperlinked.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-shrink-0 lg:flex-grow-0">
                      <p
                        className="text-sm font-medium text-gray-700"
                        aria-hidden="true">
                        Photo
                      </p>
                      <div className="mt-1 lg:hidden">
                        <div className="flex items-center">
                          <div
                            className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                            aria-hidden="true">
                            <img
                              className="h-full w-full rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                          </div>
                          <div className="ml-5 rounded-md shadow-sm">
                            <div className="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-stone-500 focus-within:ring-offset-2 hover:bg-gray-50">
                              <label
                                htmlFor="mobile-user-photo"
                                onClick={handlePhotoChange}
                                className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700">
                                <span>Change</span>
                                <span className="sr-only"> user photo</span>
                              </label>
                              <input
                                id="mobile-user-photo"
                                onClick={handlePhotoChange}
                                name="user-photo"
                                type="file"
                                className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative hidden overflow-hidden rounded-full lg:block">
                        <img
                          className="relative h-40 w-40 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                        <label
                          htmlFor="desktop-user-photo"
                          onClick={handlePhotoChange}
                          className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100">
                          <span>Change</span>
                          <span className="sr-only"> user photo</span>
                          <input
                            type="file"
                            id="desktop-user-photo"
                            name="user-photo"
                            className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-6">
                      <label
                        htmlFor="fullname"
                        className="block text-sm font-medium text-gray-700">
                        Full name
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        id="fullname"
                        autoComplete="given-name"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-stone-500 sm:text-sm"
                        value={user.name}
                        onChange={handleFullNameChange}
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium text-gray-700">
                        User ID
                      </label>
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="family-name"
                        className={disabledInput}
                        defaultValue={user.sub}
                        readOnly
                      />
                    </div>

                    <div className="col-span-12">
                      <label
                        htmlFor="url"
                        className="block text-sm font-medium text-gray-700">
                        URL
                      </label>
                      <input
                        type="text"
                        name="url"
                        id="url"
                        className={disabledInput}
                        readOnly
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700">
                        Birthdate
                      </label>
                      <input
                        type="text"
                        name="company"
                        id="company"
                        autoComplete="organization"
                        className={disabledInput}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Saving Section */}
                <div className="divide-y divide-gray-200 pt-6">
                  <div className="mt-4 flex justify-end py-4 px-4 sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2">
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-stone-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                      onClick={saveDetails}>
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
