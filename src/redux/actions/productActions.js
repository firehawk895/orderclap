import * as types from "./actionTypes";
import * as orderApi from "../../api/productsApi";

export function loadProductsSuccess(products) {
  return { type: types.LOAD_PRODUCTS_SUCCESS, products };
}

// look ma its a thunk
export function loadProducts() {
  return function(dispatch) {
    return orderApi
      .getProducts()
      .then(orders => {
        dispatch(loadProductsSuccess(orders));
      })
      .catch(error => {
        //TODO: convert this to error handler, toast and shiz I guess
        // also an error action and that needs to be handled
        throw error;
      });
  };
}
