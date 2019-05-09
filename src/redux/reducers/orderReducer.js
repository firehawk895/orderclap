import * as types from "../actions/actionTypes";
import initialStateState from "./initialState";

export default function orderReducer(state = initialStateState.orders, action) {
  switch (action.type) {
    case types.LOAD_ORDERS_SUCCESS:
      return action.orders;
    default:
      return state;
  }
}
