import { handleResponse, handleError } from "./apiUtils";
// this shit needs to be set somewhere
// const baseUrl = process.env.API_URL + "/orders/";
const baseUrl = "http://localhost:3001" + "/orders/";

export function getOrders() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}

// export function saveCourse(course) {
//   return fetch(baseUrl + (course.id || ""), {
//     method: course.id ? "PUT" : "POST", // POST for create, PUT to update when id already exists.
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify(course)
//   })
//     .then(handleResponse)
//     .catch(handleError);
// }

// export function deleteCourse(courseId) {
//   return fetch(baseUrl + courseId, { method: "DELETE" })
//     .then(handleResponse)
//     .catch(handleError);
// }
