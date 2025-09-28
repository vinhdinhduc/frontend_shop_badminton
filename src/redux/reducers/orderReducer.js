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

const initialState = {
  orderUser: [],
  loading: false,
  arrOrders: [],
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_ORDER_REQUEST:
      return { ...state, loading: true };

    case FETCH_ALL_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        arrOrders: action.payload,
        error: null,
      };

    case FETCH_ALL_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        arrOrders: [],
        error: action.payload,
      };
    case FETCH_ORDER_BY_USER_ID_REQUEST:
      return { ...state, loading: true };

    case FETCH_ORDER_BY_USER_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        orderUser: action.payload,
        error: null,
      };

    case FETCH_ORDER_BY_USER_ID_FAIL:
      return {
        ...state,
        loading: false,
        orderUser: [],
        error: action.payload,
      };

    default:
      return state;
  }
};
export default orderReducer;
