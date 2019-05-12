import * as types from "../actions/actionTypes";
import initialStateState from "./initialState";

export default function cartReducer(state = initialStateState.carts, action) {
  switch (action.type) {
    case types.LOAD_CARTS_SUCCESS:
      return action.carts;
    default:
      return state;
  }
}
