import { combineReducers } from "redux";
import orders from "./orderReducer";
import products from "./productReducer";
import carts from "./cartReducer";

const rootReducer = combineReducers({
  orders,
  products,
  carts
});

export default rootReducer;
