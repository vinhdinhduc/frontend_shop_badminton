import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
  FETCH_USER_ADDRESS_PROFILE_REQUEST,
  FETCH_USER_ADDRESS_PROFILE_SUCCESS,
  FETCH_USER_ADDRESS_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_AVATAR_REQUEST,
  UPDATE_AVATAR_SUCCESS,
  UPDATE_AVATAR_FAIL,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAIL,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAIL,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAIL,
  SET_DEFAULT_ADDRESS_REQUEST,
  SET_DEFAULT_ADDRESS_SUCCESS,
  SET_DEFAULT_ADDRESS_FAIL,
} from "../constants/profileConstant";
import { toast } from "react-toastify";
import {
  getProfileService,
  updateProfileService,
  updateAvatarService,
  changePasswordService,
  addAddressService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
  getUserAddressService,
} from "../../services/profileService";

// Fetch profile
export const getProfileAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PROFILE_REQUEST });
    const res = await getProfileService(id);
    if (res && res.code === 0) {
      dispatch({ type: FETCH_PROFILE_SUCCESS, payload: res.data });
      toast.success("Lấy profile thành công");
    }
  } catch (error) {
    dispatch({
      type: FETCH_PROFILE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
export const getUserAddressesAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_USER_ADDRESS_PROFILE_REQUEST });
    const res = await getUserAddressService(id);
    if (res && res.code === 0) {
      dispatch({ type: FETCH_USER_ADDRESS_PROFILE_SUCCESS, payload: res.data });
    }
  } catch (error) {
    dispatch({
      type: FETCH_USER_ADDRESS_PROFILE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};

// Update profile
export const updateUserProfileAction = (profileData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    const res = await updateProfileService(profileData);
    if (res && res.code === 0) {
      dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: res.data });
      toast.success("Cập nhật thông tin thành công!");
    }
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};

// Update avatar
export const updateAvatarAction = (avatarFile) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_AVATAR_REQUEST });
    const res = await updateAvatarService(avatarFile);
    if (res && res.code === 0) {
      dispatch({ type: UPDATE_AVATAR_SUCCESS, payload: res.data });
      toast.success("Cập nhật ảnh đại diện thành công!");
    }
  } catch (error) {
    dispatch({
      type: UPDATE_AVATAR_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};

// Change password
export const changePasswordAction =
  (currentPass, newPass) => async (dispatch) => {
    try {
      dispatch({ type: CHANGE_PASSWORD_REQUEST });
      const res = await changePasswordService(currentPass, newPass);
      if (res && res.code === 0) {
        dispatch({ type: CHANGE_PASSWORD_SUCCESS });
        toast.success("Đổi mật khẩu thành công!");
      }
    } catch (error) {
      dispatch({
        type: CHANGE_PASSWORD_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.message || error.message);
    }
  };

// Add address
export const createAddressAction = (addressData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_ADDRESS_REQUEST });
    const res = await addAddressService(addressData);
    if (res && res.code === 0) {
      dispatch({ type: ADD_ADDRESS_SUCCESS, payload: res.data });
      toast.success("Thêm địa chỉ thành công!");
    }
  } catch (error) {
    dispatch({
      type: ADD_ADDRESS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};

// Update address
export const updateAddressAction = (id, addressData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ADDRESS_REQUEST });
    const res = await updateAddressService(id, addressData);
    if (res && res.code === 0) {
      dispatch({ type: UPDATE_ADDRESS_SUCCESS, payload: res.data });
      toast.success("Cập nhật địa chỉ thành công!");
    }
  } catch (error) {
    dispatch({
      type: UPDATE_ADDRESS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};

// Delete address
export const deleteAddressAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ADDRESS_REQUEST });
    const res = await deleteAddressService(id);
    if (res && res.code === 0) {
      dispatch({ type: DELETE_ADDRESS_SUCCESS, payload: id });
      toast.success("Xóa địa chỉ thành công!");
    }
  } catch (error) {
    dispatch({
      type: DELETE_ADDRESS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};

// Set default address
export const setDefaultAddressAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: SET_DEFAULT_ADDRESS_REQUEST });
    const res = await setDefaultAddressService(id);
    if (res && res.code === 0) {
      dispatch({ type: SET_DEFAULT_ADDRESS_SUCCESS, payload: id });
      toast.success("Đặt địa chỉ mặc định thành công!");
    }
  } catch (error) {
    dispatch({
      type: SET_DEFAULT_ADDRESS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.message);
  }
};
