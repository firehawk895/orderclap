const orders = [
  {
    id: 35150614,
    status: "checked-in",
    supplier: "Organo Fresh",
    order_placed: "20080915T155300",
    order_total: 3072,
    invoice_no: "1502"
  },
  {
    id: 35150615,
    status: "submitted",
    supplier: "Organo Fresh",
    order_placed: "20080915T155300",
    order_total: 3072,
    invoice_no: "1503"
  },
  {
    id: 35150616,
    status: "checked-in",
    supplier: "Ghoda Fresh",
    order_placed: "20080915T155300",
    order_total: 3072,
    invoice_no: "1504"
  },
  {
    id: 35150617,
    status: "checked-in",
    supplier: "Kaithal Fresh",
    order_placed: "20080915T155300",
    order_total: 3072,
    invoice_no: "1505"
  }
];
// const authors = [
//   { id: 1, name: "Cory House" },
//   { id: 2, name: "Scott Allen" },
//   { id: 3, name: "Dan Wahlin" }
// ];

// const newCourse = {
//   id: null,
//   title: "",
//   authorId: null,
//   category: ""
// };

// Using CommonJS style export so we can consume via Node (without using Babel-node)
module.exports = {
  orders
};
