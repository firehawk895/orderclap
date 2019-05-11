import * as types from "../actions/actionTypes";
import initialStateState from "./initialState";

export default function productReducer(
  state = initialStateState.products,
  action
) {
  switch (action.type) {
    case types.LOAD_PRODUCTS_SUCCESS:
      return action.products;
    default:
      return state;
  }
}
