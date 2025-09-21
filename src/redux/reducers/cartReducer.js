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
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  APPLY_COUPON_FAILURE,
  REMOVE_COUPON,
  CALCULATE_SHIPPING_REQUEST,
  CALCULATE_SHIPPING_SUCCESS,
  CALCULATE_SHIPPING_FAILURE,
  SET_LOADING_ITEM,
  RESET_CART_ERROR,
} from "../constants/cartConstant";

const initialState = {
  // Cart data
  items: [],
  totalItems: 0,
  totalAmount: 0,

  // Loading states
  loading: false,
  addingToCart: false,
  loadingItems: {}, // Track loading state for individual items

  // Error states
  error: null,
  addToCartError: null,

  // Cart count
  cartCount: 0,
  cartCountLoading: false,

  // Coupon/Discount
  coupon: null,
  discountAmount: 0,
  couponLoading: false,
  couponError: null,

  // Shipping
  shippingFee: 0,
  shippingMethod: null,
  shippingLoading: false,
  shippingError: null,

  // UI states
  isCartOpen: false,
  lastAddedItem: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Add to cart
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
        addingToCart: true,
        addToCartError: null,
      };

    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        addingToCart: false,
        addToCartError: null,
        lastAddedItem: action.payload.data || null,
      };

    case ADD_TO_CART_FAILURE:
      return {
        ...state,
        addingToCart: false,
        addToCartError: action.payload,
      };

    // Get cart
    case GET_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_CART_SUCCESS:
      const cartData = action.payload.data || {};
      return {
        ...state,
        loading: false,
        error: null,
        items: cartData.items || [],
        totalItems: cartData.itemCount || 0,
        totalAmount: cartData.total || 0,
        cartCount: cartData.itemCount || 0,
      };

    case GET_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        items: [],
        totalItems: 0,
        totalAmount: 0,
        cartCount: 0,
      };

    // Update cart item
    case UPDATE_CART_ITEM_REQUEST:
      return {
        ...state,
        loadingItems: {
          ...state.loadingItems,
          [action.payload.itemId]: true,
        },
      };

    case UPDATE_CART_ITEM_SUCCESS:
      return {
        ...state,
        loadingItems: {
          ...state.loadingItems,
          [action.payload.itemId]: false,
        },
      };

    case UPDATE_CART_ITEM_FAILURE:
      return {
        ...state,
        loadingItems: {
          ...state.loadingItems,
          [action.payload.itemId]: false,
        },
        error: action.payload.error,
      };

    // Remove from cart
    case REMOVE_FROM_CART_REQUEST:
      return {
        ...state,
        loadingItems: {
          ...state.loadingItems,
          [action.payload.itemId]: true,
        },
      };

    case REMOVE_FROM_CART_SUCCESS:
      return {
        ...state,
        loadingItems: {
          ...state.loadingItems,
          [action.payload.itemId]: false,
        },
        items: state.items.filter((item) => item.id !== action.payload.itemId),
      };

    case REMOVE_FROM_CART_FAILURE:
      return {
        ...state,
        loadingItems: {
          ...state.loadingItems,
          [action.payload.itemId]: false,
        },
        error: action.payload.error,
      };

    // Clear cart
    case CLEAR_CART_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [],
        totalItems: 0,
        totalAmount: 0,
        cartCount: 0,
        coupon: null,
        discountAmount: 0,
        shippingFee: 0,
      };

    case CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Cart count
    case GET_CART_COUNT_REQUEST:
      return {
        ...state,
        cartCountLoading: true,
      };

    case GET_CART_COUNT_SUCCESS:
      return {
        ...state,
        cartCountLoading: false,
        cartCount: action.payload.data?.count || 0,
      };

    case GET_CART_COUNT_FAILURE:
      return {
        ...state,
        cartCountLoading: false,
        cartCount: 0,
      };

    // Merge cart
    case MERGE_CART_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case MERGE_CART_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case MERGE_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Coupon actions
    case APPLY_COUPON_REQUEST:
      return {
        ...state,
        couponLoading: true,
        couponError: null,
      };

    case APPLY_COUPON_SUCCESS:
      const couponData = action.payload.data || {};
      return {
        ...state,
        couponLoading: false,
        couponError: null,
        coupon: couponData.coupon || null,
        discountAmount: couponData.discount_amount || 0,
        totalAmount: Math.max(
          0,
          state.totalAmount - (couponData.discount_amount || 0)
        ),
      };

    case APPLY_COUPON_FAILURE:
      return {
        ...state,
        couponLoading: false,
        couponError: action.payload,
      };

    case REMOVE_COUPON:
      return {
        ...state,
        coupon: null,
        discountAmount: 0,
        couponError: null,
        totalAmount: state.items.reduce(
          (sum, item) => sum + (item.total_price || 0),
          0
        ),
      };

    // Shipping actions
    case CALCULATE_SHIPPING_REQUEST:
      return {
        ...state,
        shippingLoading: true,
        shippingError: null,
      };

    case CALCULATE_SHIPPING_SUCCESS:
      const shippingData = action.payload.data || {};
      return {
        ...state,
        shippingLoading: false,
        shippingError: null,
        shippingFee: shippingData.fee || 0,
        shippingMethod: shippingData.method || null,
      };

    case CALCULATE_SHIPPING_FAILURE:
      return {
        ...state,
        shippingLoading: false,
        shippingError: action.payload,
      };

    // Local actions
    case SET_CART_ITEM_QUANTITY:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId
            ? {
                ...item,
                quantity: action.payload.quantity,
                total_price: item.unit_price * action.payload.quantity,
              }
            : item
        ),
        totalAmount: state.items.reduce(
          (sum, item) =>
            item.id === action.payload.itemId
              ? sum + item.unit_price * action.payload.quantity
              : sum + (item.total_price || 0),
          0
        ),
      };

    case SET_LOADING_ITEM:
      return {
        ...state,
        loadingItems: {
          ...state.loadingItems,
          [action.payload.itemId]: action.payload.loading,
        },
      };

    case RESET_CART_ERROR:
      return {
        ...state,
        error: null,
        addToCartError: null,
        couponError: null,
        shippingError: null,
      };

    default:
      return state;
  }
};

export default cartReducer;
