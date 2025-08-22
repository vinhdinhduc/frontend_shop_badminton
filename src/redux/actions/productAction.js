import {
  PRODUCT_ADD_REQUEST,
  PRODUCT_ADD_SUCCESS,
  PRODUCT_ADD_FAIL,
  PRODUCT_FETCH_REQUEST,
  PRODUCT_FETCH_SUCCESS,
  PRODUCT_FETCH_FAIL,
} from "../constants/productConstant";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { createProduct, getAllProduct } from "../../services/productService";

export const addProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_ADD_REQUEST });
    const res = await createProduct(productData);

    if (res && res.code === 0) {
      dispatch({ type: PRODUCT_ADD_SUCCESS, payload: res });
      toast.success("Thêm mới sản phẩm thành công!");
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_ADD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(`Thêm sản phẩm thất bại! "${error.message}"`);
  }
};
export const fetchProduct = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_FETCH_REQUEST });
    const res = await getAllProduct();

    if (res && res.code === 0) {
      console.log("res-product", res);

      dispatch({
        type: PRODUCT_FETCH_SUCCESS,
        payload: {
          products: res,
          totalProducts: res.data.length,
        },
      });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_FETCH_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(`Lỗi khi lấy sản phẩm! "${error.message}"`);
  }
};
