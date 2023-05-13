import "../styles/globals.css";
import { NextComponentType, NextPageContext } from "next";
import { Auth as AmplifyAuth, API } from "aws-amplify";
import { LoginState, StateProvider, useStateValue } from "../context/state";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";
import MainNav from "../components/UI/MainNav";
import Footer from "../components/UI/Footer";
import { LoaderLarge } from "../components/UI/Loaders";

type AppProps = {
  pageProps: any;
  Component: NextComponentType<NextPageContext, any, {}> & {
    layoutProps: any;
  } & { auth: boolean };
};

const authHeader = async () => {
  return {
    Authorization: `Bearer ${(await AmplifyAuth.currentSession())
      .getIdToken()
      .getJwtToken()}`,
  };
};

AmplifyAuth.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID,
  },
});

API.configure({
  API: {
    endpoints: [
      {
        name: "API",
        endpoint: process.env.NEXT_PUBLIC_AWSAPIENDPOINT,
        custom_header: authHeader,
      },
    ],
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const initialState = {
    loginState: LoginState.Loading,
  };

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "setLoginState":
        return {
          ...state,
          loginState: action.loginState,
        };
      case "setUser":
        return {
          ...state,
          user: action.user,
        };

      default:
        return state;
    }
  };

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>Photo Uploader - A NextJS &amp; Tailwind Project</title>
        <meta
          name="description"
          content="Frontend for AWS, ServerLess Photo Uploader tool"
        />
      </Head>
      <MainNav />
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
      <Footer />
    </StateProvider>
  );
}

const Auth = ({ children }: any) => {
  const [{ loginState }, dispatch] = useStateValue();

  const router = useRouter();

  useEffect(() => {
    isLoggedIn().then((loggedIn) => {
      dispatch({
        type: "setLoginState",
        loginState: loggedIn ? LoginState.SignedIn : LoginState.NotSignedIn,
      });
      // Redirect if not logged in and not on homepage
      if (!loggedIn && router.pathname !== "/") router.push("/auth/signin");
    });
  }, []);

  return loginState === LoginState.Loading ? <LoaderLarge /> : <>{children}</>;
};

const isLoggedIn = async () => {
  try {
    let session = await AmplifyAuth.currentSession();
    return true;
  } catch (err) {
    return false;
  }
};

export default MyApp;
