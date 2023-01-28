import type { NextPage } from "next";
import HomepageIntro from "../components/Homepage/HomepageIntro";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

const HomePage: NextPage & { auth: boolean } = () => {
  const [loading, setLoading] = useState(true);
  const [userSignedIn, setUserSignedIn] = useState(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => {
        setUserSignedIn(true);
      })
      .catch(() => {
        setUserSignedIn(false);
      });
    setLoading(false);
  }, []);

  return (
    <>
      <main className="">
        <div className="container max-w-7xl mx-auto py-6 px-4 ">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <HomepageIntro userSignedIn={userSignedIn} />
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
HomePage.auth = true;
