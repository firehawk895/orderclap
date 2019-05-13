import parse from "date-fns/parse";
import format from "date-fns/format";

export function is8601_to_readable(iso8601_string) {
  if (iso8601_string) {
    return format(parse(iso8601_string), ["MMM DD, YYYY HH:mm:SS A"]);
  } else {
    return null;
  }
}
