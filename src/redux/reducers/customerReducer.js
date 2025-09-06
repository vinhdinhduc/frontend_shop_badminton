import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
} from "../constants/userConstant";

const initialState = {
  loading: false,
  error: null,
  arrUsers: [],
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
    default:
      return state;
  }
};
export default userReducer;
