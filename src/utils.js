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

export function is8601_to_readable_date(iso8601_string) {
  if (iso8601_string) {
    return format(parse(iso8601_string), ["MMM DD, YYYY"]);
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

// https://stackoverflow.com/a/24710857/1881812
export function isEmptyObject(obj) {
  return Object.keys(obj).length == 0 ? true : false;
}

// https://teamtreehouse.com/community/iterating-through-two-arrays-at-the-same-time
// zip python equivalent in js
export const zip = (a, b) => a.map((x, i) => [x, b[i]]);

/* 
snapped from - https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
I use this in a single-page content management app. There's a list of records and a search input. Every character you put into the search bar updates the list of records shown.
What it does is that it allows you to search texts based on multiple whole words. But the key feature is that the last word doesn't have to be whole. For example, it will positively match "This is a blog post about JavaScript" if the search is "post javascript" or "post javasc". But it won't match on "pos blog".
The idea is that if a user has typed in a full word followed by a space, all previous words needs to be matched fully. For example if the input is "java " it won't match on "This is a blog post about JavaScript" because the word java, alone, isn't in the search text.
Sure, there are different ways to write this but I think this functionality is good for this kind of filtering search. A different implementation would have a function that returns the regex and then it can be used both for filtering and for highlighting.

'a.b.etc'.split('.').reduce((o,i)=>o[i], obj)
*/
export function filterList(q, list, attribute_list) {
  /*
  q query string to search for
  list is the list of objects to search for
  attribute_list is the list of attributes of the object to match on, can use dot object notation
  */

  function escapeRegExp(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  const words = q
    .split(/\s+/g)
    .map(s => s.trim())
    .filter(s => !!s);
  const hasTrailingSpace = q.endsWith(" ");
  const searchRegex = new RegExp(
    words
      .map((word, i) => {
        if (i + 1 === words.length && !hasTrailingSpace) {
          // The last word - ok with the word being "startswith"-like
          return `(?=.*\\b${escapeRegExp(word)})`;
        } else {
          // Not the last word - expect the whole word exactly
          return `(?=.*\\b${escapeRegExp(word)}\\b)`;
        }
      })
      .join("") + ".+",
    "gi"
  );
  return list.filter(item => {
    let result = false;
    attribute_list.forEach(attr => {
      // This beautiful stackoverflow answer converts dot notation into an object reference
      // https://stackoverflow.com/a/6394168/1881812
      // 'a.b.etc'.split('.').reduce((o,i)=>o[i], obj)
      result =
        result ||
        searchRegex.test(attr.split(".").reduce((o, i) => o[i], item));
    });
    return result;
  });
}
