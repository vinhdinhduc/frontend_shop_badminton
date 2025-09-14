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
  SOFT_DELETE_USER_REQUEST,
  SOFT_DELETE_USER_SUCCESS,
  SOFT_DELETE_USER_FAIL,
  FETCH_USER_SOFT_DELETED_REQUEST,
  FETCH_USER_SOFT_DELETED_SUCCESS,
  FETCH_USER_SOFT_DELETED_FAIL,
  HARD_DELETE_USER_REQUEST,
  HARD_DELETE_USER_SUCCESS,
  HARD_DELETE_USER_FAIL,
  RESTORE_USER_REQUEST,
  RESTORE_USER_SUCCESS,
  RESTORE_USER_FAIL,
  BULK_HARD_DELETE_USER_REQUEST,
  BULK_HARD_DELETE_USER_SUCCESS,
  BULK_HARD_DELETE_USER_FAIL,
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
    case SOFT_DELETE_USER_REQUEST:
      return { ...state, loading: true };

    case SOFT_DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case SOFT_DELETE_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case HARD_DELETE_USER_REQUEST:
      return { ...state, loading: true };

    case HARD_DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case HARD_DELETE_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case RESTORE_USER_REQUEST:
      return { ...state, loading: true };

    case RESTORE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case RESTORE_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case BULK_HARD_DELETE_USER_REQUEST:
      return { ...state, loading: true };

    case BULK_HARD_DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case BULK_HARD_DELETE_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default userReducer;
