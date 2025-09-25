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

const initialState = {
  brands: [],
  featuredBrands: [],
  currentBrand: null,
  pagination: null,
  loading: false,
  error: null,
};

export const brandReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRANDS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_BRANDS_SUCCESS:
      return {
        ...state,
        loading: false,
        brands: action.payload.brands,
        pagination: action.payload.pagination || null,
        error: null,
      };

    case GET_BRANDS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_FEATURED_BRANDS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_FEATURED_BRANDS_SUCCESS:
      return {
        ...state,
        loading: false,
        featuredBrands: action.payload.data || [],
        error: null,
      };

    case GET_FEATURED_BRANDS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_BRAND_BY_ID_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_BRAND_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentBrand: action.payload.data || null,
        error: null,
      };

    case GET_BRAND_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        currentBrand: null,
        error: action.payload,
      };
    case CREATE_BRAND_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_BRAND_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case CREATE_BRAND_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_BRAND_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_BRAND_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case UPDATE_BRAND_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_BRAND_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DELETE_BRAND_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case DELETE_BRAND_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
