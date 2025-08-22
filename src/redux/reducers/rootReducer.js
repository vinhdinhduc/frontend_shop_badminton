import { combineReducers } from "redux";

import userLoginReducer from "./userReducer";
import productReducer from "./productReducer";
const rootReducer = combineReducers({
  //   productList: productListReducer,
  //   productDetails: productDetailsReducer,
  //   cart: cartReducer,
  userLogin: userLoginReducer,
  productList: productReducer,
});

export default rootReducer;
