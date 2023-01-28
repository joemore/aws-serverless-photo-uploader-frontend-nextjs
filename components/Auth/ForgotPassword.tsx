import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Auth } from "aws-amplify";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const initialState = { email: "", password: "", authCode: "" };
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [confirmCodeSent, setConfirmCodeSent] = useState(false);
  const [errMsg, setErrMsg] = useState<string | boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | boolean>(false);

  function onChangeHandler(e: any) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }
  const { email, password, authCode } = formState;

  const onFormSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return false;
    }
    setErrMsg(false);
    setSuccessMsg(false);
    setLoading(true);

    // First request a confirm code
    if (!confirmCodeSent) {
      try {
        await Auth.forgotPassword(email);
        setConfirmCodeSent(true);
      } catch (err: any) {
        setErrMsg(err.message);
      }
    }

    // Then submit the confirm code
    if (confirmCodeSent) {
      try {
        await Auth.forgotPasswordSubmit(email, authCode, password);
        setSuccessMsg("Password reset successfully! You can now login again!");
      } catch (err: any) {
        setErrMsg(err.message);
      }
    }

    setLoading(false);
  };

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
                className="font-medium text-cyan-600 hover:text-cyan-500">
                return to login
              </Link>
            </p>

            {/* Developer only - toggle state */}
            {/* <button
              className="mt-2 opacity-50 text-red-500"
              onClick={() => setConfirmCodeSent(!confirmCodeSent)}>
              DEV - Toggle State
            </button> */}
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
                    `appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm`
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
                    className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
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
                    className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Enter New Password"
                    onInput={onChangeHandler}
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loading ? (
                    <ArrowPathIcon
                      className="h-5 w-5 text-sky-200 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <LockClosedIcon
                      className="h-5 w-5 text-cyan-500 group-hover:text-cyan-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
                {!confirmCodeSent && "Email me a reset code"}
                {confirmCodeSent && "Enter Code & Reset Password"}
              </button>
            </div>

            {/* Display success and error messages */}
            {errMsg && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {errMsg}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            {successMsg && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      {successMsg}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
