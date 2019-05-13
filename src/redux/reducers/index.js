import { combineReducers } from "redux";
import orders from "./orderReducer";
import products from "./productReducer";
import carts from "./cartReducer";
import apiCallsInProgress from "./apiStatusReducer";

const rootReducer = combineReducers({
  orders,
  products,
  carts,
  apiCallsInProgress
});

export default rootReducer;
