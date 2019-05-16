import { handleResponse, handleError } from "./apiUtils";
// this shit needs to be set somewhere
// const baseUrl = process.env.API_URL + "/orders/";
const baseUrl = "http://127.0.0.1:8000" + "/carts/";

export function getCarts() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}

export function deleteCartItem(cartItemId) {
  return fetch(baseUrl + cartItemId + "/", { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}
