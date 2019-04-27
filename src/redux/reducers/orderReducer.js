import * as types from "../actions/actionTypes";

export default function orderReducer(state = [], action) {
  switch (action.type) {
    case types.LOAD_ORDERS_SUCCESS:
      return action.orders;
    default:
      return state;
  }
}
