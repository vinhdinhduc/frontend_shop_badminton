import {
  PRODUCT_ADD_REQUEST,
  PRODUCT_ADD_SUCCESS,
  PRODUCT_ADD_FAIL,
} from "../constants/productConstant";

const initialState = {
  loading: false,
  product: null,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_ADD_REQUEST:
      return { ...state, loading: true };

    case PRODUCT_ADD_SUCCESS:
      return { loading: false, product: action.payload, error: null };

    case PRODUCT_ADD_FAIL:
      return { loading: false, product: null, error: action.payload };

    default:
      return state;
  }
};
export default productReducer;
