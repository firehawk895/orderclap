import parse from "date-fns/parse";
import format from "date-fns/format";
import { toast } from "react-toastify";
import flatten from "flat";

export function is8601_to_readable(iso8601_string) {
  if (iso8601_string) {
    return format(parse(iso8601_string), ["MMM DD, YYYY HH:mm:SS A"]);
  } else {
    return null;
  }
}

/*
Expectation: 
* APIs or whatevers will throw a javascript Error object.
* Error.message will contain the string (which is actually a json)
that contains the standard django error formatted json.
* we jsonify that string and display some error toasts
* the standard django error obj is:
{
  <fieldName> : [<array of string messages>]
}
*/
export function errorToaster(message) {
  const errorObj = JSON.parse(message);
  // a django error object will have deep nesting depending on the request
  // lets flatten and display all the error messages
  let flatshiz = flatten(errorObj);
  console.log("hey developer, here's a more detailed error for you:");
  console.log(flatshiz);
  for (let key in flatshiz) {
    toast.error(key + " " + flatshiz[key]);
  }
}
