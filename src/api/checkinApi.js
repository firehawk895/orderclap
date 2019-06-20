import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/checkin/";

export function checkin(checkinData) {
  /*
      Sample request:
          {
              order: 1,
              order_items: [
                  {
                      id: 1,
                      status: "Received (Full)",
                      qty_received: 4
                  },
                  {
                      id: 2,
                      status: "Received (Full)",
                      qty_received: 5
                  },
              ]
          }
      */
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(checkinData)
  })
    .then(handleResponse)
    .catch(handleError);
}
