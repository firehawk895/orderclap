import * as types from "./actionTypes";
import * as cartsApi from "../../api/cartsApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadCartsSuccess(carts) {
  return { type: types.LOAD_CARTS_SUCCESS, carts };
}

export function deleteCartItemOptimistic(cartItem) {
  return { type: types.DELETE_CART_ITEM_OPTIMISTIC, cartItem };
}

export function createCartItemSuccess(cartItem) {
  return { type: types.CREATE_CART_ITEM_SUCCESS, cartItem };
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

export function addCartItem(productId, supplierId, quantity) {
  return function(dispatch, getState) {
    console.log(getState());
    const {
      restaurant: { id: restaurantId }
    } = getState();
    return cartsApi
      .saveCartItem(productId, restaurantId, supplierId, quantity)
      .then(savedCartItem => {
        console.log("lets see what the saved cart item looks like");
        console.log(savedCartItem);
        dispatch(createCartItemSuccess(savedCartItem));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function deleteCartItem(cartItem) {
  console.log(
    "In deleteCartItem, about to return function bound with dispatch"
  );
  console.log(cartItem);
  return function(dispatch) {
    // Doing optimistic delete, so not dispatching begin/end api call
    // actions, or apiCallError action since we're not showing the loading status for this
    dispatch(deleteCartItemOptimistic(cartItem));
    return cartsApi.deleteCartItem(cartItem.id);
  };
}
