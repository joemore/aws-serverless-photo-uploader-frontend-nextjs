import { LockClosedIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const initialState = { email: "", password: "", name: "" };
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  function onChangeHandler(e: any) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }
  const { email, password, name } = formState;

  const onFormSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return false;
    }
    setLoading(true);
    console.log(formState);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const [confirmCodeSent, setConfirmCodeSent] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Forgot Password?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Actually, I do know it...{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-sky-600 hover:text-sky-500">
                return to login
              </Link>
            </p>

            {/* Developer only - toggle state */}
            <button
              className="mt-2 opacity-50 text-red-500"
              onClick={() => setConfirmCodeSent(!confirmCodeSent)}>
              DEV - Toggle State
            </button>
          </div>
          <form
            className="mt-8 space-y-6"
            action="#"
            method="POST"
            onSubmit={onFormSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={clsx(
                    confirmCodeSent ? "bg-gray-200" : "",
                    `appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm`
                  )}
                  placeholder="Email address"
                  onInput={onChangeHandler}
                  readOnly={confirmCodeSent}
                  disabled={confirmCodeSent}
                />
              </div>
            </div>

            {confirmCodeSent && (
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="authCode" className="sr-only">
                    Enter 6 Digit Code
                  </label>
                  <input
                    id="authCode"
                    name="authCode"
                    type="text"
                    autoComplete="password"
                    required
                    className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                    placeholder="Enter 6 Digit Code _ _ _ _ _"
                    onInput={onChangeHandler}
                  />
                </div>
                <div>
                  <label htmlFor="new-address" className="sr-only">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    required
                    className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                    placeholder="Enter New Password"
                    onInput={onChangeHandler}
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-sky-500 group-hover:text-sky-400"
                    aria-hidden="true"
                  />
                </span>
                {!confirmCodeSent && "Email me a reset code"}
                {confirmCodeSent && "Enter Code & Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
