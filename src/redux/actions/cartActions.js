import * as types from "./actionTypes";
import * as cartsApi from "../../api/cartsApi";
import { beginApiCall } from "./apiStatusActions";

export function loadCartsSuccess(carts) {
  return { type: types.LOAD_CARTS_SUCCESS, carts };
}

// look ma its a thunk
export function loadCarts() {
  return function(dispatch) {
    dispatch(beginApiCall());
    return cartsApi
      .getCarts()
      .then(carts => {
        dispatch(loadCartsSuccess(carts));
      })
      .catch(error => {
        //TODO: convert this to error handler, toast and shiz I guess
        // also an error action and that needs to be handled
        throw error;
      });
  };
}
