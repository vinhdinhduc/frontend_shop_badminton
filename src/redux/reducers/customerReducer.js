import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  FETCH_USER_SOFT_DELETED_REQUEST,
  FETCH_USER_SOFT_DELETED_SUCCESS,
  FETCH_USER_SOFT_DELETED_FAIL,
} from "../constants/userConstant";

const initialState = {
  loading: false,
  error: null,
  arrUsers: [],
  listUserDeleted: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return { ...state, loading: true };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        arrUsers: action.payload,
        error: null,
      };

    case FETCH_USER_FAIL:
      return { ...state, loading: false, arrUsers: [], error: action.payload };
    case CREATE_USER_REQUEST:
      return { ...state, loading: true };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case CREATE_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_USER_REQUEST:
      return { ...state, loading: true };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case UPDATE_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case FETCH_USER_SOFT_DELETED_REQUEST:
      return { ...state, loading: true };

    case FETCH_USER_SOFT_DELETED_SUCCESS:
      return {
        ...state,
        loading: false,
        listUserDeleted: action.payload,
        error: null,
      };

    case FETCH_USER_SOFT_DELETED_FAIL:
      return {
        ...state,
        loading: false,
        listUserDeleted: [],
        error: action.payload,
      };
    default:
      return state;
  }
};
export default userReducer;
