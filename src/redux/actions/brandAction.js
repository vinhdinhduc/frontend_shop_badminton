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

import { getAllBrands, getBrandById } from "../../services/brandService";

export const getBrandsAction =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_BRANDS_START });

      const response = await getAllBrands(params);
      console.log("Check brand", response);

      dispatch({
        type: GET_BRANDS_SUCCESS,
        payload: response.data,
      });
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
