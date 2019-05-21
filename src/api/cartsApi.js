import { handleResponse, handleError } from "./apiUtils";
import qs from "qs";
// this shit needs to be set somewhere
// const baseUrl = process.env.API_URL + "/orders/";
const baseUrl = "http://127.0.0.1:8000" + "/carts/";

export function getCarts() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}

export function saveCartItem(productId, restaurantId, supplierId, quantity) {
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: qs.stringify({
      product: productId,
      restaurant: restaurantId,
      supplier: supplierId,
      quantity: quantity
    })
  })
    .then(handleResponse)
    .catch(handleError);
}

export function updateCartItem(cartItemId, quantity) {
  const patch_url = baseUrl + cartItemId + "/";
  return fetch(patch_url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: qs.stringify({
      quantity: quantity
    })
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteCartItem(cartItemId) {
  return fetch(baseUrl + cartItemId + "/", { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteCartBySuppliers(restaurantId, supplierIdList) {
  return fetch(baseUrl + "delete_suppliers_cart" + "/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      restaurant: restaurantId,
      supplier_list: supplierIdList
    })
  })
    .then(handleResponse)
    .catch(handleError);
}
