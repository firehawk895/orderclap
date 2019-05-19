import parse from "date-fns/parse";
import format from "date-fns/format";
import { toast } from "react-toastify";

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
  for (let key in errorObj) {
    errorObj[key].forEach(chotaError => toast.error(key + " : " + chotaError));
  }
}
