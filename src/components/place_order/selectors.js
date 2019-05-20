export function getSupplierMap(cartState) {
  //making a map keyed with supplier
  let supplier_map = cartState.results.reduce(function(map, obj) {
    map[obj.supplier.id] = { supplier: obj.supplier, cart_items: [] };
    return map;
  }, {});
  // filling each supplier with its cart_items
  cartState.results.forEach(result => {
    supplier_map[result.supplier.id].cart_items.push(result);
  });

  // supplier map looks like:
  /*
  {
     <supplier_id> : {
         supplier: <supplier Object>,
         cart_items: <Array of Cart Items>
     },
     <supplier_id> : {
         supplier: <supplier Object>,
         cart_items: <Array of Cart Items>
     },
     ...
  }
  Each Cart Item object looks like:
  {
      supplier: supplier Object,
      product: product Object,
      restaurant: restaurant Object,
      quantity: <number>,
      note: <String>
  }
  */
  const total_key = "total";
  for (let key in supplier_map) {
    let supplier_total = 0;
    supplier_map[key].cart_items.forEach(
      cart_item =>
        (supplier_total += cart_item.quantity * cart_item.product.price)
    );
    supplier_map[key][total_key] = supplier_total;
  }
  return supplier_map;
}
