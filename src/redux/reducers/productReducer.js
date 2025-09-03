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
  HARD_DELETE_PRODUCT_REQUEST,
  HARD_DELETE_PRODUCT_SUCCESS,
  HARD_DELETE_PRODUCT_FAIL,
  RESTORE_PRODUCT_REQUEST,
  RESTORE_PRODUCT_SUCCESS,
  RESTORE_PRODUCT_FAIL,
} from "../constants/productConstant";

const initialState = {
  loading: false,
  product: null,
  arrProduct: [],
  arrProductId: [],
  arrDeletedProduct: [],
  error: null,
  totalProducts: 0,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_ADD_REQUEST:
      return { ...state, loading: true };

    case PRODUCT_ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
        error: null,
      };

    case PRODUCT_ADD_FAIL:
      return { ...state, loading: false, product: [], error: action.payload };
    case PRODUCT_FETCH_REQUEST:
      return { ...state, loading: true };

    case PRODUCT_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        arrProduct: action.payload.products,
        totalProducts: action.payload.totalProducts,
        error: null,
      };

    case PRODUCT_FETCH_FAIL:
      return {
        ...state,
        loading: false,
        arrProduct: null,
        error: action.payload,
      };
    case FETCH_PRODUCT_BY_ID_REQUEST:
      return { ...state, loading: true };

    case FETCH_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        arrProductId: action.payload,
        error: null,
      };

    case FETCH_PRODUCT_BY_ID_FAIL:
      return {
        ...state,
        loading: false,
        arrProductId: null,
        error: action.payload,
      };
    case UPDATE_PRODUCT_REQUEST:
      return { ...state, loading: true };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
        error: null,
      };

    case UPDATE_PRODUCT_FAIL:
      return { ...state, loading: false, product: null, error: action.payload };
    case SOFT_DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true };

    case SOFT_DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,

        error: null,
      };

    case SOFT_DELETE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case FETCH_SOFT_DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true };

    case FETCH_SOFT_DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        arrDeletedProduct: action.payload,
        error: null,
      };

    case FETCH_SOFT_DELETE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        arrDeletedProduct: [],
        error: action.payload,
      };
    case HARD_DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true };

    case HARD_DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case HARD_DELETE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case RESTORE_PRODUCT_REQUEST:
      return { ...state, loading: true };

    case RESTORE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case RESTORE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default productReducer;
