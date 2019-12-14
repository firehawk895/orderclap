import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/orders/";
import qs from "qs";

export function getOrders(queryParams) {
  return fetch(baseUrl + "?" + qs.stringify(queryParams))
    .then(handleResponse)
    .catch(handleError);
}

export function getOrderDetails(orderId) {
  const url = baseUrl + orderId + "/";
  return fetch(url)
    .then(handleResponse)
    .catch(handleError);
}

export function patchOrder(orderId, payload) {
  const url = baseUrl + orderId + "/";
  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(handleResponse)
    .catch(handleError);
}
