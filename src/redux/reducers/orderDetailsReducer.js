import * as types from "../actions/actionTypes";
import initialStateState from "./initialState";

export default function orderDetailsReducer(
  state = initialStateState.orderDetails,
  action
) {
  switch (action.type) {
    case types.LOAD_ORDER_DETAILS_SUCCESS:
      return action.order;
    default:
      return state;
  }
}
