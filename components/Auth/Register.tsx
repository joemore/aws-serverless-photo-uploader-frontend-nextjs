import {
  ArrowPathIcon as RefreshIcon,
  PencilSquareIcon as PencilAltIcon,
} from "@heroicons/react/24/solid";
import { Auth } from "aws-amplify";
import Link from "next/link";
import { useState } from "react";
import AvatarDropdown from "../UI/AvatarDropdown";
import Notifications from "../UI/Notifications";
import RegisterConfirm from "./RegisterConfirm";

const REGIONS = [
  { label: "London", val: "eu-west-2" },
  { label: "Mumbai", val: "ap-south-1" },
  { label: "Sydney", val: "ap-southeast-2" },
  { label: "Sao Paulo", val: "sa-east-1" },
];

export default function RegisterAccount() {
  const initialState = {
    email: "",
    password: "",
    fullname: "",
    region: "",
    avatar:
      "https://www.joemore.com/images/avatars/account-avatar-profile-user-01-svgrepo-com-cropped.svg",
  };
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [confirmCode, setConfirmCode] = useState(false);
  const [errMsg, setErrMsg] = useState<string | boolean>(false);

  function onChangeHandler(e: any) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  const onChangeAvatar = function (e: any) {
    setFormState({ ...formState, avatar: e.avatar });
  };

  // Is email address valid function
  const isEmailValid = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Error checking - front end only needs to do basic error checking, as we rely on the backend error checking mainly
  const validateForm = () => {
    if (formState.region === "") {
      setErrMsg("Please choose a region");
      return false;
    }
    if (formState.email === "") {
      setErrMsg("Please enter an email address");
      return false;
    }
    if (!isEmailValid(formState.email)) {
      setErrMsg("Please enter a valid email address");
      return false;
    }
    if (formState.password === "") {
      setErrMsg("Please enter a password");
      return false;
    }
    if (formState.fullname === "") {
      setErrMsg("Please enter your full name");
      return false;
    }
    if (formState.avatar === "") {
      setErrMsg("Please choose an avatar");
      return false;
    }

    return true;
  };

  // Submitting the form
  const { email, password, fullname, region, avatar } = formState;
  const onFormSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return false;
    }

    if (!validateForm()) {
      return false;
    }

    setLoading(true);
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          name: fullname,
          picture: avatar,
          email,
          "custom:region": region,
        },
      });
      setConfirmCode(!confirmCode);
    } catch (error: any) {
      console.log("Error signing up:", error);
      setErrMsg(error.message);
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
                Register a new Account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-sky-600 hover:text-sky-500">
                  login to existing account
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
                  <label htmlFor="full-name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    name="fullname"
                    type="text"
                    autoComplete="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    onChange={onChangeHandler}
                    value={fullname}
                  />
                </div>
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    onChange={onChangeHandler}
                    value={password}
                  />
                </div>

                {/* Choose region */}
                <div className="relative">
                  <select
                    id="region"
                    name="region"
                    autoComplete="region"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                    placeholder="Region"
                    onChange={onChangeHandler}
                    value={region}>
                    <option value="">Choose a region</option>
                    {REGIONS.map((region) => (
                      <option key={region.val} value={region.val}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Choose Avatar */}
                <div className="pt-3">
                  <AvatarDropdown
                    label="Choose an avatar"
                    currentAvatar={1}
                    onChangeAvatar={onChangeAvatar}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {loading ? (
                      <RefreshIcon
                        className="h-5 w-5 text-sky-200 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <PencilAltIcon
                        className="h-5 w-5 text-sky-500 group-hover:text-sky-400"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  {loading ? `Registering...` : "Register new account"}
                </button>
              </div>

              {/* SOCIAL Register */}

              {/* <Spacer />
              <p className="text-center mb-3 text-sm">Or Register with</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    <BsFacebook className="h-5 w-5" />
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <BsGoogle className="h-5 w-5" />
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Apple</span>
                    <BsApple className="h-5 w-5" />
                  </a>
                </div>
              </div> */}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
