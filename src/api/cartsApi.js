import { handleResponse, handleError } from "./apiUtils";
// this shit needs to be set somewhere
// const baseUrl = process.env.API_URL + "/orders/";
const baseUrl = "http://localhost:3001" + "/carts/";

export function getCarts() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}
