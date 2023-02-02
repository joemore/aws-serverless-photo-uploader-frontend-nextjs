import {
  ArrowPathIcon as RefreshIcon,
  CheckCircleIcon,
  LockOpenIcon,
} from "@heroicons/react/24/solid";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { useState } from "react";
import { LoginState, useStateValue } from "../../context/state";

export default function RegisterConfirm(props: any) {
  const initialState = {
    email: props.email,
    authCode: "",
    password: props.password || false,
  };
  const [formState, setFormState] = useState(initialState);
  const [resendSent, setResendSent] = useState(null);
  const [errMsg, setErrMsg] = useState<string | boolean>(false);
  const [loading, setLoading] = useState(false);

  const [{ setLoginState }, dispatch] = useStateValue();

  const { email, authCode, password } = formState;
  const router = useRouter();
  function onChangeHandler(e: any) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  const onFormSubmit = async (e: any) => {
    setResendSent(null);
    setErrMsg(false);
    e.preventDefault();
    if (loading) {
      return false;
    }
    setLoading(true);
    try {
      await Auth.confirmSignUp(email, authCode);
      await Auth.signIn(email, password);
      dispatch({ type: "setLoginState", loginState: LoginState.SignedIn });

      await router.push("/");
    } catch (error: any) {
      console.log("Error:", error);
      setErrMsg(error.message);
    }
    setLoading(false);
  };

  const resendConfirmationCode = async () => {
    setErrMsg(false);
    try {
      await Auth.resendSignUp(email);
      setResendSent(email);
    } catch (error: any) {
      console.log("Error:", error);
      setErrMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 mb-3 text-center text-3xl font-extrabold text-gray-900">
              Confirmation Code
            </h2>
            <p className="text-center">
              Enter the confirmation code sent to <b>{email || "[EMAIL]"}</b>
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
                  Enter 6 Digit Code
                </label>
                <input
                  id="authCode"
                  name="authCode"
                  type="text"
                  autoComplete="authCode"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-stone-500 focus:border-stone-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 6 Digit Code _ _ _ _ _ _"
                  onInput={onChangeHandler}
                />
              </div>
            </div>
            {errMsg && <p className="text-red-600">{errMsg}</p>}
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
                    <LockOpenIcon
                      className="h-5 w-5 text-stone-500 group-hover:text-stone-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
                {loading ? `Verifying...` : "Submit Confirmation Code"}
              </button>
            </div>

            <div className="text-sm text-center">
              <span
                className="cursor-pointer font-medium text-stone-600 hover:text-stone-500"
                onClick={resendConfirmationCode}>
                Resend Confirmation Code?
              </span>
              {resendSent && (
                <div className="text-green-600 mt-5">
                  <CheckCircleIcon className="h-5 w-5 inline" /> A new code has
                  been sent to: <b>{resendSent}</b>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
