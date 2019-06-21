import * as types from "./actionTypes";
import * as sendOrdersApi from "../../api/sendOrdersApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

// helpers
// don't lodash for 1 method bro
function flatten(arrayOfarrays) {
  return [].concat.apply([], arrayOfarrays);
}

function getCartIdListFromOrderObjectList(orderObjectList) {
  const cartIdListOfLists = orderObjectList.map(iter => iter["cart_items"]);
  const cartIdList = flatten(cartIdListOfLists).map(iter => iter["id"]);
  return cartIdList;
}

//Action creators
export function sendOrdersSuccess(cartIdList) {
  return { type: types.SEND_ORDERS_SUCCESS, cartIdList };
}

//Thunks
export function sendOrders(orderObjectList) {
  return function(dispatch, getState) {
    const {
      restaurant: { id: restaurantId }
    } = getState();
    dispatch(beginApiCall());
    return sendOrdersApi
      .sendOrders(restaurantId, orderObjectList)
      .then(results => {
        dispatch(
          sendOrdersSuccess(getCartIdListFromOrderObjectList(orderObjectList))
        );
      })
      .catch(error => {
        dispatch(apiCallError());
        throw error;
      });
  };
}
