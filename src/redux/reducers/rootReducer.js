import { combineReducers } from "redux";

import userLoginReducer from "./userReducer";

const rootReducer = combineReducers({
  //   productList: productListReducer,
  //   productDetails: productDetailsReducer,
  //   cart: cartReducer,
  userLogin: userLoginReducer,
});

export default rootReducer;
