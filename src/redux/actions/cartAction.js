import { toast } from "react-toastify";

import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE,
  GET_CART_COUNT_REQUEST,
  GET_CART_COUNT_SUCCESS,
  GET_CART_COUNT_FAILURE,
  MERGE_CART_REQUEST,
  MERGE_CART_SUCCESS,
  MERGE_CART_FAILURE,
  SET_CART_ITEM_QUANTITY,
} from "../constants/cartConstant";
import {
  addToCart,
  clearCart,
  getCartCount,
  getCarts,
  mergeCart,
  removeFromCart,
  updateCartItem,
} from "../../services/cartService";
const getUserIdentifier = (getState) => {
  const state = getState();
  console.log("Check tstate", state);

  const user = state.userLogin?.userInfo?.data?.user;
  console.log("check user", user);

  if (user?.id) {
    return { user_id: user.id };
  } else {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId =
        "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("cart_session_id", sessionId);
    }
    return { session_id: sessionId };
  }
};
export const buyNowAction = (productData) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: ADD_TO_CART_REQUEST });

      const userIdentifier = getUserIdentifier(getState);
      const cartData = {
        ...userIdentifier,
        product_id: productData.product.id,
        variation_id: productData.selectedOptions?.variation_id || null,
        quantity: productData.quantity || 1,
        variation_info: productData.selectedOptions?.weight || null,
      };
      console.log("Check product data", productData);
      console.log("Check cart data", cartData);

      const res = await addToCart(cartData);
      console.log("Check res buy now action", res);

      dispatch({
        type: ADD_TO_CART_SUCCESS,
        payload: res,
      });

      //Get cart new

      const cartResponse = await dispatch(getCartAction());
      toast.success("Đã thêm sản phẩm! Đang chuyển đến trang thanh toán...");
      return cartResponse;
    } catch (error) {
      dispatch({
        type: ADD_TO_CART_FAILURE,
        payload: error.message,
      });

      toast.error(error.message || "Không thể thêm sản phẩm");
      throw error;
    }
  };
};
export const addToCartAction = (productData) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: ADD_TO_CART_REQUEST });

      const userIdentifier = getUserIdentifier(getState);
      const cartData = {
        ...userIdentifier,
        product_id: productData.product.id,
        variation_id: productData.selectedOptions?.variation_id || null,
        quantity: productData.quantity || 1,
        variation_info: productData.selectedOptions?.weight || null,
      };

      const response = await addToCart(cartData);

      dispatch({
        type: ADD_TO_CART_SUCCESS,
        payload: response,
      });

      dispatch(getCartAction());

      toast.success("Đã thêm sản phẩm vào giỏ hàng!");

      return response;
    } catch (error) {
      dispatch({
        type: ADD_TO_CART_FAILURE,
        payload: error.message,
      });

      toast.error(error.message || "Không thể thêm sản phẩm vào giỏ hàng");
      throw error;
    }
  };
};

export const getCartAction = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: GET_CART_REQUEST });

      const userIdentifier = getUserIdentifier(getState);
      const response = await getCarts(userIdentifier);
      console.log("Check response action", response);

      dispatch({
        type: GET_CART_SUCCESS,
        payload: response,
      });

      return response;
    } catch (error) {
      dispatch({
        type: GET_CART_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const updateCartItemAction = (itemId, quantity) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_CART_ITEM_QUANTITY,
        payload: { itemId, quantity },
      });

      dispatch({
        type: UPDATE_CART_ITEM_REQUEST,
        payload: { itemId },
      });

      const response = await updateCartItem(itemId, quantity);

      dispatch({
        type: UPDATE_CART_ITEM_SUCCESS,
        payload: { itemId, data: response },
      });

      dispatch(getCartAction());

      return response;
    } catch (error) {
      dispatch({
        type: UPDATE_CART_ITEM_FAILURE,
        payload: { itemId, error: error.message },
      });

      dispatch(getCartAction());

      toast.error(error.message || "Không thể cập nhật số lượng");
      throw error;
    }
  };
};

export const removeFromCartAction = (itemId) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: REMOVE_FROM_CART_REQUEST,
        payload: { itemId },
      });

      const response = await removeFromCart(itemId);
      if (response && response.code === 0) {
        dispatch({
          type: REMOVE_FROM_CART_SUCCESS,
          payload: { itemId },
        });

        dispatch(getCartAction());
      }

      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");

      return response;
    } catch (error) {
      dispatch({
        type: REMOVE_FROM_CART_FAILURE,
        payload: { itemId, error: error.message },
      });

      toast.error(error.message || "Không thể xóa sản phẩm");
      throw error;
    }
  };
};

export const clearCartAction = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: CLEAR_CART_REQUEST });

      const userIdentifier = getUserIdentifier(getState);
      const response = await clearCart(userIdentifier);

      dispatch({
        type: CLEAR_CART_SUCCESS,
        payload: response,
      });

      toast.success("Đã xóa toàn bộ giỏ hàng");

      return response;
    } catch (error) {
      dispatch({
        type: CLEAR_CART_FAILURE,
        payload: error.message,
      });

      toast.error(error.message || "Không thể xóa giỏ hàng");
      throw error;
    }
  };
};

export const getCartCountAction = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ GET_CART_COUNT_REQUEST });

      const userIdentifier = getUserIdentifier(getState);
      const response = await getCartCount(userIdentifier);
      console.log("check res cartcount", response);

      dispatch({
        type: GET_CART_COUNT_SUCCESS,
        payload: response,
      });

      return response;
    } catch (error) {
      dispatch({
        type: GET_CART_COUNT_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const mergeCartAction = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: MERGE_CART_REQUEST });

      const state = getState();
      const user = state.auth?.user;
      const sessionId = localStorage.getItem("cart_session_id");

      if (!user?.id || !sessionId) {
        throw new Error("Missing user or session data for merge");
      }

      const mergeData = {
        user_id: user.id,
        session_id: sessionId,
      };

      const response = await mergeCart(mergeData);

      dispatch({
        type: MERGE_CART_SUCCESS,
        payload: response,
      });

      // Clear session ID after successful merge
      localStorage.removeItem("cart_session_id");

      // Refresh cart
      dispatch(getCartAction());

      return response;
    } catch (error) {
      dispatch({
        type: MERGE_CART_FAILURE,
        payload: error.message,
      });
    }
  };
};

// export const applyCoupon = (couponCode) => {
// return async (dispatch, getState) => {
//   try {
//     dispatch({ type: CART_ACTION_TYPES.APPLY_COUPON_REQUEST });

//     const state = getState();
//     const cartTotal = state.cart.totalAmount || 0;

//     const response = await cartService.applyCoupon(couponCode, cartTotal);

//     dispatch({
//       type: CART_ACTION_TYPES.APPLY_COUPON_SUCCESS,
//       payload: response,
//     });

//     toast.success("Áp dụng mã giảm giá thành công!");

//     return response;
//   } catch (error) {
//     dispatch({
//       type: CART_ACTION_TYPES.APPLY_COUPON_FAILURE,
//       payload: error.message,
//     });

//     toast.error(error.message || "Mã giảm giá không hợp lệ");
//     throw error;
//   }
// };
// };

// export const removeCoupon = () => {
//   return (dispatch) => {
//     dispatch({ type: CART_ACTION_TYPES.REMOVE_COUPON });
//     toast.success('Đã hủy mã giảm giá');
//   };
// };

// export const calculateShipping = (address) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({ type: CART_ACTION_TYPES.CALCULATE_SHIPPING_REQUEST });

//       const state = getState();
//       const items = state.cart.items || [];

//       const response = await cartService.calculateShipping(address, items);

//       dispatch({
//         type: CART_ACTION_TYPES.CALCULATE_SHIPPING_SUCCESS,
//         payload: response
//       });

//       return response;
//     } catch (error) {
//       dispatch({
//         type: CART_ACTION_TYPES.CALCULATE_SHIPPING_FAILURE,
//         payload: error.message
//       });

//       throw error;
//     }
//   };
// };

// export const setLoadingItem = (itemId, loading) => ({
//   type: CART_ACTION_TYPES.SET_LOADING_ITEM,
//   payload: { itemId, loading }
// });

// export const resetCartError = () => ({
//   type: CART_ACTION_TYPES.RESET_CART_ERROR
// });

// export const initializeCart = () => {
//   return async (dispatch) => {
//     try {
//       await dispatch(getCart());
//       await dispatch(getCartCount());
//     } catch (error) {
//       console.error('Failed to initialize cart:', error);
//     }
//   };
// };
