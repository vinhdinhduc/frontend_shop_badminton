import {
  GET_BRANDS_START,
  GET_BRANDS_SUCCESS,
  GET_BRANDS_FAILURE,
  GET_BRAND_BY_ID_START,
  GET_BRAND_BY_ID_SUCCESS,
  GET_BRAND_BY_ID_FAILURE,
  GET_FEATURED_BRANDS_START,
  GET_FEATURED_BRANDS_SUCCESS,
  GET_FEATURED_BRANDS_FAILURE,
  CREATE_BRAND_START,
  CREATE_BRAND_SUCCESS,
  CREATE_BRAND_FAILURE,
  UPDATE_BRAND_START,
  UPDATE_BRAND_SUCCESS,
  UPDATE_BRAND_FAILURE,
  DELETE_BRAND_START,
  DELETE_BRAND_SUCCESS,
  DELETE_BRAND_FAILURE,
} from "../constants/brandConstant";

import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
} from "../../services/brandService";
import { toast } from "react-toastify";

export const getBrandsAction =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_BRANDS_START });

      const response = await getAllBrands(params);
      console.log("Check action", response.data);
      if (response && response.code === 0) {
        dispatch({
          type: GET_BRANDS_SUCCESS,
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_BRANDS_FAILURE,
        payload: error.response?.data?.message || "Lỗi khi tải thương hiệu",
      });
    }
  };

// Get brand by ID
export const getBrandByIdAction = (brandId) => async (dispatch) => {
  try {
    dispatch({ type: GET_BRAND_BY_ID_START });

    const response = await getBrandById(brandId);

    dispatch({
      type: GET_BRAND_BY_ID_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_BRAND_BY_ID_FAILURE,
      payload:
        error.response?.data?.message || "Lỗi khi tải thông tin thương hiệu",
    });
  }
};
export const createBrandAction = (dataBrand) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_BRAND_START });

    const response = await createBrand(dataBrand);
    if (response && response.code === 0) {
      dispatch({
        type: CREATE_BRAND_SUCCESS,
        payload: response.data,
      });
      toast.success("Thêm thương hiệu thành công!");
      dispatch(getAllBrands());
    }
  } catch (error) {
    dispatch({
      type: CREATE_BRAND_FAILURE,
      payload: error.response?.data?.message || "Lỗi khi thêm thương hiệu",
    });
  }
};
export const updateBrandAction = (id, dataUpdate) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BRAND_START });

    const response = await updateBrand(id, dataUpdate);
    if (response && response.code === 0) {
      dispatch({
        type: UPDATE_BRAND_SUCCESS,
        payload: response.data,
      });
      toast.success("Cập nhật thương hiệu thành công!");
      dispatch(getAllBrands());
    }
  } catch (error) {
    dispatch({
      type: UPDATE_BRAND_FAILURE,
      payload: error.response?.data?.message || "Lỗi khi cập nhật thương hiệu",
    });
  }
};
export const deleteBrandAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BRAND_START });

    const response = await deleteBrand(id);
    if (response && response.code === 0) {
      dispatch({
        type: DELETE_BRAND_SUCCESS,
        payload: response.data,
      });
      toast.success("Xoá thương hiệu thành công!");
      dispatch(getAllBrands());
    }
  } catch (error) {
    dispatch({
      type: DELETE_BRAND_FAILURE,
      payload: error.response?.data?.message || "Lỗi khi xoá thương hiệu",
    });
  }
};
