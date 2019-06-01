import * as types from "./actionTypes";
import * as orderApi from "../../api/orderApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadOrdersSuccess(orders) {
  return { type: types.LOAD_ORDERS_SUCCESS, orders };
}

export function loadOrderDetailsSuccess(order) {
  return { type: types.LOAD_ORDER_DETAILS_SUCCESS, order };
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
        dispatch(apiCallError());
        //TODO: convert this to error handler, toast and shiz I guess
        // also an error action and that needs to be handled
        throw error;
      });
  };
}

export function loadOrderDetails(orderId) {
  return function(dispatch) {
    dispatch(beginApiCall());
    return orderApi
      .getOrderDetails(orderId)
      .then(order => {
        dispatch(loadOrderDetailsSuccess(order));
      })
      .catch(error => {
        dispatch(apiCallError());
        throw error;
      });
  };
}
