import * as types from "./actionTypes";
import * as checkinApi from "../../api/checkinApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

// Action Creators
export function checkinSuccess() {
  return { type: types.CHECKIN_SUCCESS };
}

// Thunks
export function checkin(checkinData) {
  return function(dispatch) {
    dispatch(beginApiCall());
    return checkinApi
      .checkin(checkinData)
      .then(results => {
        dispatch(checkinSuccess());
      })
      .catch(error => {
        dispatch(apiCallError());
        throw error;
      });
  };
}
