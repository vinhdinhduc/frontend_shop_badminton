import { combineReducers } from "redux";
import customerReducer from "./customerReducer";
import userReducer from "./userReducer";
import productReducer from "./productReducer";
import orderReducer from "./orderReducer";
import cartReducer from "./cartReducer";
import profileReducer from "./profileReducer";
import { brandReducer } from "./brandReducer";
const rootReducer = combineReducers({
  profileList: profileReducer,
  cartList: cartReducer,
  orderList: orderReducer,
  customerList: customerReducer,
  userLogin: userReducer,
  productList: productReducer,
  brandList: brandReducer,
});

export default rootReducer;
