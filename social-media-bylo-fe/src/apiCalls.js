import axios from "axios";
export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      "http://localhost:8800/api/v1/auth/login",
      userCredentials,
      { withCredentials: true }
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({
      type: "LOGIN_FAILURE",
      payload: err,
    });
  }
};
