import * as types from "../actions/actionTypes";
import initialStateState from "./initialState";

export default function cartReducer(state = initialStateState.carts, action) {
  switch (action.type) {
    case types.LOAD_CARTS_SUCCESS:
      return action.carts;
    case types.CREATE_CART_ITEM_OPTIMISTIC:
      return {
        results: [...state.results, { ...action.cartItem }]
      };
    case types.UPDATE_CART_ITEM_OPTIMISTIC:
      return {
        results: state.results.map(cartItem =>
          cartItem.id === action.cartItem.id ? action.cartItem : cartItem
        )
      };
    case types.DELETE_CART_ITEM_OPTIMISTIC:
      return {
        results: state.results.filter(
          cartItem => cartItem.id !== action.cartItemId
        )
      };
    case types.DELETE_CART_BY_SUPPLIERS_OPTIMISTIC:
      return {
        results: state.results.filter(
          cartItem => !action.supplierIdList.includes(cartItem.supplier.id)
        )
      };
    default:
      return state;
  }
}
