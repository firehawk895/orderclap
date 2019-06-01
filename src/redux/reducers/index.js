import { combineReducers } from "redux";
import orders from "./orderReducer";
import orderDetails from "./orderDetailsReducer";
import products from "./productReducer";
import carts from "./cartReducer";
import restaurant from "./restaurantReducer";
import apiCallsInProgress from "./apiStatusReducer";

const rootReducer = combineReducers({
  orders,
  products,
  carts,
  apiCallsInProgress,
  restaurant,
  orderDetails
});

export default rootReducer;
