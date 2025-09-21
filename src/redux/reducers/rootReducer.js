import { combineReducers } from "redux";
import customerReducer from "./customerReducer";
import userReducer from "./userReducer";
import productReducer from "./productReducer";
import orderReducer from "./orderReducer";
import cartReducer from "./cartReducer";
const rootReducer = combineReducers({
  //   productList: productListReducer,
  //   productDetails: productDetailsReducer,
  cartList: cartReducer,
  orderList: orderReducer,
  customerList: customerReducer,
  userLogin: userReducer,
  productList: productReducer,
});

export default rootReducer;
