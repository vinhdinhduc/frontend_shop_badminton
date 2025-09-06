import { combineReducers } from "redux";
import customerReducer from "./customerReducer";
import userReducer from "./userReducer";
import productReducer from "./productReducer";
const rootReducer = combineReducers({
  //   productList: productListReducer,
  //   productDetails: productDetailsReducer,
  //   cart: cartReducer,
  customerList: customerReducer,
  userLogin: userReducer,
  productList: productReducer,
});

export default rootReducer;
