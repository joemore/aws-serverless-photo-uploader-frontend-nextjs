import type { NextPage } from "next";
import BreadCrumbs from "../../components/UI/BreadCrumbs";
import SignIn from "../../components/Auth/SignIn";

const SignInPage: NextPage = () => {
  return (
    <>
      <main className="">
        <BreadCrumbs
          links={[
            { url: "/", text: "Homepage" },
            { url: "/auth/signin", text: "Sign In" },
          ]}
        />
        <div className="container max-w-7xl mx-auto pb-6 px-4 ">
          <SignIn />
        </div>
      </main>
    </>
  );
};

export default SignInPage;
