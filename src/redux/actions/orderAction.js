import {
  ADD_ORDER_REQUEST,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,
  FETCH_ALL_ORDER_REQUEST,
  FETCH_ALL_ORDER_SUCCESS,
  FETCH_ALL_ORDER_FAIL,
  FETCH_ORDER_BY_USER_ID_REQUEST,
  FETCH_ORDER_BY_USER_ID_SUCCESS,
  FETCH_ORDER_BY_USER_ID_FAIL,
} from "../constants/orderConstant";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { getAllOrder, getOrderByUserId } from "../../services/orderService";

export const getAllOrders = (query) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ALL_ORDER_REQUEST });
    const res = await getAllOrder(query);
    if (res && res.code === 0) {
      dispatch({ type: FETCH_ALL_ORDER_SUCCESS, payload: res });
    }
  } catch (error) {
    dispatch({
      type: FETCH_ALL_ORDER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
export const getOrderByUserIdAction = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDER_BY_USER_ID_REQUEST });
    const res = await getOrderByUserId(userId);
    console.log("Check res order by id", res, userId);

    if (res && res.code === 0) {
      dispatch({ type: FETCH_ORDER_BY_USER_ID_SUCCESS, payload: res });
    }
  } catch (error) {
    dispatch({
      type: FETCH_ORDER_BY_USER_ID_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
