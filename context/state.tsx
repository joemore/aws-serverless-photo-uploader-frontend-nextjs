import React, { createContext, useContext, useReducer } from "react";

export const LoginState = {
  Loading: "Loading",
  SignedIn: "SignedIn",
  NotSignedIn: "NotSignedIn",
};

export const StateContext = createContext<any>(null);
export const StateProvider = ({ reducer, initialState, children }: any) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useStateValue = () => useContext(StateContext);
