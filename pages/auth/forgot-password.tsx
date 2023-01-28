import type { NextPage } from "next";
// import { FcMultipleSmartphones } from "react-icons/fc";
import ForgotPassword from "../../components/Auth/ForgotPassword";
import BreadCrumbs from "../../components/UI/BreadCrumbs";

const SignInPage: NextPage = () => {
  return (
    <>
      <main className="">
        <BreadCrumbs
          links={[
            { url: "/", text: "Homepage" },
            { url: "/auth/forgot-password", text: "Forgot Password" },
          ]}
        />
        <div className="container max-w-7xl mx-auto pb-6 px-4 ">
          <ForgotPassword />
        </div>
      </main>
    </>
  );
};

export default SignInPage;
