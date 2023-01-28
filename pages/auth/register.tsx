import type { NextPage } from "next";
import BreadCrumbs from "../../components/UI/BreadCrumbs";
import RegisterAccount from "../../components/Auth/Register";

const SignInPage: NextPage = () => {
  return (
    <>
      <main className="">
        <BreadCrumbs
          links={[
            { url: "/", text: "Homepage" },
            { url: "/auth/register", text: "Register" },
          ]}
        />
        <div className="container max-w-7xl mx-auto pb-6 px-4 ">
          <RegisterAccount />
        </div>
      </main>
    </>
  );
};

export default SignInPage;
