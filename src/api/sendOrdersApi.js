import { handleResponse, handleError } from "./apiUtils";
// this shit needs to be set somewhere
// const baseUrl = process.env.API_URL + "/orders/";
const baseUrl = "http://127.0.0.1:8000" + "/send_orders/";

export function sendOrders(restaurantId, orderObjectList) {
  /*
    Sample request:
        // Array of items, so send out multiple orders freely
        // All this information is sent for a backend integrity check
        // coz optimistic delete and all
        [{
            "supplier": 1,
            "req_dd": "2019-11-21",
            "restaurant":1,
            "cart_items": [{
                "id": 152,
                "product": 1,
                "quantity": 2
            },
            {
                "id": 153,
                "product": 2,
                "quantity": 1
            }]
        }]
    */
  // lets inject the restaurant into each order
  const restaurant_key = "restaurant";
  orderObjectList.map(item => {
    item[restaurant_key] = restaurantId;
    return item;
  });
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderObjectList)
  })
    .then(handleResponse)
    .catch(handleError);
}
