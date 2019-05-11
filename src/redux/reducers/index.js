import { combineReducers } from "redux";
import orders from "./orderReducer";
import products from "./productReducer";

const rootReducer = combineReducers({
  orders,
  products
});

export default rootReducer;
