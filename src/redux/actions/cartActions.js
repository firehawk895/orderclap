import * as types from "./actionTypes";
import * as cartsApi from "../../api/cartsApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadCartsSuccess(carts) {
  return { type: types.LOAD_CARTS_SUCCESS, carts };
}

export function deleteCartItemOptimistic(cartItemId) {
  return { type: types.DELETE_CART_ITEM_OPTIMISTIC, cartItemId };
}

export function createCartItemOptimistic(cartItem) {
  return { type: types.CREATE_CART_ITEM_OPTIMISTIC, cartItem };
}

export function updateCartItemOptimistic(cartItem) {
  return { type: types.UPDATE_CART_ITEM_OPTIMISTIC, cartItem };
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
    const {
      restaurant: { id: restaurantId }
    } = getState();
    return cartsApi
      .saveCartItem(productId, restaurantId, supplierId, quantity)
      .then(savedCartItem => {
        dispatch(createCartItemOptimistic(savedCartItem));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function updateCartItem(cartItemId, quantity) {
  return function(dispatch) {
    return cartsApi
      .updateCartItem(cartItemId, quantity)
      .then(updatedCartItem => {
        dispatch(updateCartItemOptimistic(updatedCartItem));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function deleteCartItem(cartItemId) {
  return function(dispatch) {
    // Doing optimistic delete, so not dispatching begin/end api call
    // actions, or apiCallError action since we're not showing the loading status for this
    dispatch(deleteCartItemOptimistic(cartItemId));
    return cartsApi.deleteCartItem(cartItemId);
  };
}
