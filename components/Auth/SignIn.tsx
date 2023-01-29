import {
  ArrowPathIcon as RefreshIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { Auth } from "aws-amplify";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { LoginState, useStateValue } from "../../context/state";
import Notifications from "../UI/Notifications";
import RegisterConfirm from "./RegisterConfirm";

export default function SignIn() {
  const router = useRouter();
  const initialState = { email: "", password: "" };
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [confirmCode, setConfirmCode] = useState(false);
  const [errMsg, setErrMsg] = useState<string | boolean>(false);

  const [{ setLoginState }, dispatch] = useStateValue();

  function onChangeHandler(e: any) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }
  const { email, password } = formState;

  const onFormSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return false;
    }
    setLoading(true);
    setErrMsg(false);
    try {
      await Auth.signIn(email, password);

      dispatch({ type: "setLoginState", loginState: LoginState.SignedIn });

      await router.push("/");
    } catch (err: any) {
      console.log({ err });
      if (err.code === "UserNotFoundException") {
        setErrMsg("Incorrect username or password.");
      } else if (err.code === "UserNotConfirmedException") {
        setConfirmCode(true);
      } else {
        console.log({ err });
        setErrMsg(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Notifications
        type="error"
        title="Oopsies!"
        body={errMsg}
        closeButtonText="OK... I'll try again"
        open={errMsg !== undefined && errMsg !== false}
        setOpen={setErrMsg}
      />
      {confirmCode ? (
        <RegisterConfirm email={email} password={password} />
      ) : (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Login to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-stone-600 hover:text-stone-500">
                  create a new account
                </Link>
              </p>
            </div>
            <form
              className="mt-8 space-y-6"
              action="#"
              method="POST"
              onSubmit={onFormSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    onChange={onChangeHandler}
                    value={email}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    onChange={onChangeHandler}
                    value={password}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-stone-600 focus:ring-stone-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label> */}
                </div>

                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-stone-600 hover:text-stone-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {loading ? (
                      <RefreshIcon
                        className="h-5 w-5 text-stone-200 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <LockClosedIcon
                        className="h-5 w-5 text-stone-500 group-hover:text-stone-400"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  {loading ? `Signing In...` : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
