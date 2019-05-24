import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/orders/";

export function getOrders() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}
