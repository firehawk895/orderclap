import { handleResponse, handleError } from "./apiUtils";
// this shit needs to be set somewhere
// const baseUrl = process.env.API_URL + "/orders/";
const baseUrl = "http://localhost:3001" + "/products/";

export function getProducts() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}
