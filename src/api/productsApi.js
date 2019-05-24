import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/products/";

export function getProducts() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}
