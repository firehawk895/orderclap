export const LOAD_ORDERS_SUCCESS = "LOAD_ORDERS_SUCCESS";
export const LOAD_PRODUCTS_SUCCESS = "LOAD_PRODUCTS_SUCCESS";
export const LOAD_CARTS_SUCCESS = "LOAD_CARTS_SUCCESS";
export const BEGIN_API_CALL = "BEGIN_API_CALL";
export const API_CALL_ERROR = "API_CALL_ERROR";
export const CREATE_CART_ITEM_SUCCESS = "CREATE_CART_ITEM_SUCCESS";

// By convention, actions that end in "_SUCCESS" are assumed to have been the result of a completed
// API call. But since we're doing an optimistic delete, we're hiding loading state.
// So this action name deliberately omits the "_SUCCESS" suffix.
// If it had one, our apiCallsInProgress counter would be decremented below zero
// because we're not incrementing the number of apiCallInProgress when the delete request begins.
export const DELETE_CART_ITEM_OPTIMISTIC = "DELETE_CART_ITEM_OPTIMISTIC";
