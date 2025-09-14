import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  SOFT_DELETE_USER_REQUEST,
  SOFT_DELETE_USER_SUCCESS,
  SOFT_DELETE_USER_FAIL,
  FETCH_USER_SOFT_DELETED_REQUEST,
  FETCH_USER_SOFT_DELETED_SUCCESS,
  FETCH_USER_SOFT_DELETED_FAIL,
  HARD_DELETE_USER_REQUEST,
  HARD_DELETE_USER_SUCCESS,
  HARD_DELETE_USER_FAIL,
  RESTORE_USER_REQUEST,
  RESTORE_USER_SUCCESS,
  RESTORE_USER_FAIL,
  BULK_HARD_DELETE_USER_REQUEST,
  BULK_HARD_DELETE_USER_SUCCESS,
  BULK_HARD_DELETE_USER_FAIL,
} from "../constants/userConstant";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import {
  getAllUserService,
  createNewUser,
  updateUser,
  softDeleteUser,
  getUserSoftDeleted,
  hardDeleteUser,
  restoreUser,
  bulkHardDeleteUser,
} from "../../services/userService";

export const getAllUser =
  (query = {}) =>
  async (dispatch) => {
    try {
      console.log("query in action", query);
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
export const createNewUserAction = (userData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_USER_REQUEST });
    const res = await createNewUser(userData);
    if (res && res.code === 0) {
      dispatch({ type: CREATE_USER_SUCCESS, payload: res });
      toast.success("Tạo người dùng thành công!");
      dispatch(getAllUser({ page: 1, limit: 100, search: "", role: "" }));
    }
    console.log("Check res user action", res);
  } catch (error) {
    dispatch({
      type: CREATE_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
export const updateUserAction = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });
    const res = await updateUser(id, userData);
    if (res && res.code === 0) {
      dispatch({ type: UPDATE_USER_SUCCESS, payload: res });
      toast.success("Cập nhật người dùng thành công!");
      dispatch(getAllUser());
    }
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
export const softDeleteUserAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: SOFT_DELETE_USER_REQUEST });
    const res = await softDeleteUser(id);
    if (res && res.code === 0) {
      dispatch({ type: SOFT_DELETE_USER_SUCCESS, payload: res });
      toast.success("Xoá người dùng thành công!");
      dispatch(getAllUser({ page: 1, limit: 100, search: "", role: "" }));
    }
  } catch (error) {
    dispatch({
      type: SOFT_DELETE_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};

export const getDeletedUsers = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_USER_SOFT_DELETED_REQUEST });
    const res = await getUserSoftDeleted(id);
    if (res && res.code === 0) {
      console.log("Check res getDeletedUsers action", res);

      dispatch({ type: FETCH_USER_SOFT_DELETED_SUCCESS, payload: res });
      toast.success("Lấy danh sách người dùng đã xoá thành công!");
    }
  } catch (error) {
    dispatch({
      type: FETCH_USER_SOFT_DELETED_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
export const restoreUserAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: RESTORE_USER_REQUEST });
    console.log("id to restore", id);
    const res = await restoreUser(id);
    if (res && res.code === 0) {
      dispatch({ type: RESTORE_USER_SUCCESS, payload: res });
      toast.success("Khôi phục người dùng thành công!");
      dispatch(getAllUser({ page: 1, limit: 100, search: "", role: "" }));
    }
  } catch (error) {
    dispatch({
      type: RESTORE_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
export const permanentDeleteUserAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: HARD_DELETE_USER_REQUEST });
    const res = await hardDeleteUser(id);
    if (res && res.code === 0) {
      dispatch({ type: HARD_DELETE_USER_SUCCESS, payload: res });

     
    }
  } catch (error) {
    dispatch({
      type: HARD_DELETE_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
export const permanentDeleteMultipleUsersAction = (ids) => async (dispatch) => {
  try {
    dispatch({ type: BULK_HARD_DELETE_USER_REQUEST });
    const res = await bulkHardDeleteUser(ids);
    if (res && res.code === 0) {
      dispatch({ type: BULK_HARD_DELETE_USER_SUCCESS, payload: res });

      
    }
  } catch (error) {
    dispatch({
      type: BULK_HARD_DELETE_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
