import * as types from "./actionTypes";
import * as orderApi from "../../api/orderApi";
import { beginApiCall } from "./apiStatusActions";

export function loadOrdersSuccess(orders) {
  return { type: types.LOAD_ORDERS_SUCCESS, orders };
}

// look ma its a thunk
export function loadOrders() {
  return function(dispatch) {
    dispatch(beginApiCall());
    return orderApi
      .getOrders()
      .then(orders => {
        dispatch(loadOrdersSuccess(orders));
      })
      .catch(error => {
        //TODO: convert this to error handler, toast and shiz I guess
        // also an error action and that needs to be handled
        throw error;
      });
  };
}
