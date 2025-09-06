import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
} from "../constants/userConstant";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { getAllUserService } from "../../services/userService";

export const getAllUser =
  (query = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: FETCH_USER_REQUEST });
      const res = await getAllUserService(query);
      if (res && res.code === 0) {
        dispatch({ type: FETCH_USER_SUCCESS, payload: res });
      }
      console.log("Check res user action", res);
    } catch (error) {
      dispatch({
        type: FETCH_USER_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      toast.error(error.message);
    }
  };
