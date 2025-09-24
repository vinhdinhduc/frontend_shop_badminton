import { combineReducers } from "redux";
import customerReducer from "./customerReducer";
import userReducer from "./userReducer";
import productReducer from "./productReducer";
import orderReducer from "./orderReducer";
import cartReducer from "./cartReducer";
import { brandReducer } from "./brandReducer";
const rootReducer = combineReducers({
  cartList: cartReducer,
  orderList: orderReducer,
  customerList: customerReducer,
  userLogin: userReducer,
  productList: productReducer,
  brandList: brandReducer,
});

export default rootReducer;
