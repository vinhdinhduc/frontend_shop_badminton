import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
  FETCH_USER_ADDRESS_PROFILE_REQUEST,
  FETCH_USER_ADDRESS_PROFILE_SUCCESS,
  FETCH_USER_ADDRESS_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_AVATAR_REQUEST,
  UPDATE_AVATAR_SUCCESS,
  UPDATE_AVATAR_FAIL,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAIL,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAIL,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAIL,
  SET_DEFAULT_ADDRESS_REQUEST,
  SET_DEFAULT_ADDRESS_SUCCESS,
  SET_DEFAULT_ADDRESS_FAIL,
} from "../constants/profileConstant";

const initialState = {
  loading: false,
  error: null,
  profile: null,
  addresses: [],
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch profile
    case FETCH_PROFILE_REQUEST:
      return { ...state, loading: true };

    case FETCH_PROFILE_SUCCESS:
      console.log("Check action profile red", action.payload);

      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: null,
      };

    case FETCH_PROFILE_FAIL:
      return { ...state, loading: false, profile: null, error: action.payload };
    case FETCH_USER_ADDRESS_PROFILE_REQUEST:
      return { ...state, loading: true };

    case FETCH_USER_ADDRESS_PROFILE_SUCCESS:
      console.log("Check address", action.payload);

      return {
        ...state,
        loading: false,
        addresses: action.payload,
        error: null,
      };

    case FETCH_USER_ADDRESS_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        addresses: null,
        error: action.payload,
      };

    // Update profile
    case UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: null,
      };

    case UPDATE_PROFILE_FAIL:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_AVATAR_REQUEST:
      return { ...state, loading: true };

    case UPDATE_AVATAR_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: { ...state.profile, avatar: action.payload.avatar },
        error: null,
      };

    case UPDATE_AVATAR_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CHANGE_PASSWORD_REQUEST:
      return { ...state, loading: true };

    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case CHANGE_PASSWORD_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Add address
    case ADD_ADDRESS_REQUEST:
      return { ...state, loading: true };

    case ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: [...state.addresses, action.payload],
        error: null,
      };

    case ADD_ADDRESS_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Update address
    case UPDATE_ADDRESS_REQUEST:
      return { ...state, loading: true };

    case UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: state.addresses.map((addr) =>
          addr.id === action.payload.id ? action.payload : addr
        ),
        error: null,
      };

    case UPDATE_ADDRESS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case DELETE_ADDRESS_REQUEST:
      return { ...state, loading: true };

    case DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: state.addresses.filter((addr) => addr.id !== action.payload),
        error: null,
      };

    case DELETE_ADDRESS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case SET_DEFAULT_ADDRESS_REQUEST:
      return { ...state, loading: true };

    case SET_DEFAULT_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === action.payload,
        })),
        error: null,
      };

    case SET_DEFAULT_ADDRESS_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default profileReducer;
