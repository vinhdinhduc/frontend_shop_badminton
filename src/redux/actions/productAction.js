import {
  PRODUCT_ADD_REQUEST,
  PRODUCT_ADD_SUCCESS,
  PRODUCT_ADD_FAIL,
  PRODUCT_FETCH_REQUEST,
  PRODUCT_FETCH_SUCCESS,
  PRODUCT_FETCH_FAIL,
  FETCH_PRODUCT_BY_ID_REQUEST,
  FETCH_PRODUCT_BY_ID_SUCCESS,
  FETCH_PRODUCT_BY_ID_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  SOFT_DELETE_PRODUCT_REQUEST,
  SOFT_DELETE_PRODUCT_SUCCESS,
  SOFT_DELETE_PRODUCT_FAIL,
  FETCH_SOFT_DELETE_PRODUCT_REQUEST,
  FETCH_SOFT_DELETE_PRODUCT_SUCCESS,
  FETCH_SOFT_DELETE_PRODUCT_FAIL,
} from "../constants/productConstant";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductService,
  softDelete,
} from "../../services/productService";

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
export const fetchProductById = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PRODUCT_BY_ID_REQUEST });
    const res = await getProductById(id);

    if (res && res.code === 0) {
      console.log("res-product edit", res.data);

      dispatch({
        type: FETCH_PRODUCT_BY_ID_SUCCESS,
        payload: res.data,
      });
    }
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCT_BY_ID_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(`Lỗi khi lấy sản phẩm! "${error.message}"`);
  }
};

export const updateProduct = (productData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_PRODUCT_REQUEST,
    });

    const res = await updateProductService(productData);
    if (res && res.code === 0) {
      dispatch({
        type: UPDATE_PRODUCT_SUCCESS,
        payload: res.data,
      });
      toast.success("Cập nhật sản phẩm thành công!");
      dispatch(fetchProduct());
    }
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(`Cập nhật sản phẩm thất bại! "${error.message}"`);
  }
};
export const softDeleteAction = (id) => async (dispatch) => {
  try {
    dispatch({
      type: SOFT_DELETE_PRODUCT_REQUEST,
    });

    const res = await softDelete(id);
    if (res && res.code === 0) {
      dispatch({
        type: SOFT_DELETE_PRODUCT_SUCCESS,
        payload: res.data,
      });
      toast.success("Xoá sản phẩm thành công!");
      dispatch(fetchProduct());
    }
  } catch (error) {
    dispatch({
      type: SOFT_DELETE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(`Xoá sản phẩm thất bại! "${error.message}"`);
  }
};
export const fetchSoftDeletedList = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SOFT_DELETE_PRODUCT_REQUEST });
    const res = await getAllProduct();

    if (res && res.code === 0) {
      console.log("res-product", res);

      dispatch({
        type: FETCH_SOFT_DELETE_PRODUCT_SUCCESS,
        payload: {
          products: res,
          totalProducts: res.data.length,
        },
      });
    }
  } catch (error) {
    dispatch({
      type: FETCH_SOFT_DELETE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error(`Lỗi khi lấy sản phẩm đã xoá! "${error.message}"`);
  }
};
