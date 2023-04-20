import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  // user: {
  //   data: {
  //     _id: "63de3db41d8218858e07eedc",
  //     username: "smith",
  //     email: "smith@gmail.com",
  //     profilePicture: "",
  //     coverPicture: "",
  //     followers: ["63de3da51d8218858e07eeda", "64199e8f2206649af58b732d"],
  //     following: [],
  //     isAdmin: false,
  //     createdAt: "2023-02-04T11:12:52.622Z",
  //     updatedAt: "2023-03-26T05:49:35.527Z",
  //   },
  // },
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
