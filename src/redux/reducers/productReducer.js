import {
  PRODUCT_ADD_REQUEST,
  PRODUCT_ADD_SUCCESS,
  PRODUCT_ADD_FAIL,
  PRODUCT_FETCH_REQUEST,
  PRODUCT_FETCH_SUCCESS,
  PRODUCT_FETCH_FAIL,
} from "../constants/productConstant";

const initialState = {
  loading: false,
  product: null,
  arrProduct: [],
  error: null,
  totalProducts: 0,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_ADD_REQUEST:
      return { ...state, loading: true };

    case PRODUCT_ADD_SUCCESS:
      return {
        loading: false,
        product: action.payload,
        error: null,
      };

    case PRODUCT_ADD_FAIL:
      return { loading: false, product: null, error: action.payload };
    case PRODUCT_FETCH_REQUEST:
      return { ...state, loading: true };

    case PRODUCT_FETCH_SUCCESS:
      console.log("check action : ", action.payload);

      return {
        loading: false,
        arrProduct: action.payload.products,
        totalProducts: action.payload.totalProducts,
        error: null,
      };

    case PRODUCT_FETCH_FAIL:
      return { loading: false, arrProduct: null, error: action.payload };

    default:
      return state;
  }
};
export default productReducer;
