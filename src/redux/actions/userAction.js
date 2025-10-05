import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
} from "../constants/userConstant";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { getAllUserService, loginUser } from "../../services/userService";

export const login = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const data = await loginUser(userData);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    toast.success("Đăng nhập thành công!");

    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("loginTime", new Date().toISOString());
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
export const logout = () => async (dispatch) => {
  dispatch({ type: USER_LOGOUT });
  localStorage.removeItem("userInfo");
  localStorage.removeItem("chatbot_session_id");

  toast.info("Bạn đã đăng xuất!");
};
