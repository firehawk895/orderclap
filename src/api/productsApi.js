import { handleResponse, handleError } from "./apiUtils";
// this shit needs to be set somewhere
// const baseUrl = process.env.API_URL + "/orders/";
const baseUrl = "http://127.0.0.1:8000" + "/products/";

export function getProducts() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}
