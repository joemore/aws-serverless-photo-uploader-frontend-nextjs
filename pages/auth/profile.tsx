import type { NextPage } from "next";
import ProfilePage from "../../components/Auth/ProfilePage";
import BreadCrumbs from "../../components/UI/BreadCrumbs";

const ProfilePageDisplay: NextPage & { auth: boolean } = () => {
  return (
    <>
      <main className="">
        <BreadCrumbs
          links={[
            { url: "/", text: "Home" },
            { url: "/auth/profile", text: "Profile & Account" },
          ]}
        />
        <div className=" pb-6 px-0 ">
          <ProfilePage />
        </div>
      </main>
    </>
  );
};

export default ProfilePageDisplay;
ProfilePageDisplay.auth = true;
