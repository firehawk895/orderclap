import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import { loadProducts } from "../../redux/actions/productActions";
import { loadCarts } from "../../redux/actions/cartActions";
import { InputGroup, Input } from "reactstrap";

function PlaceOrderPage({
  loadProducts,
  loadCarts,
  products: { results: product_list },
  cartMap
}) {
  useEffect(() => {
    loadProducts();
    loadCarts();
  }, []);
  return (
    <>
      <h2>Place Order:</h2>
      <FilterableProductsTable products={product_list} cartMap={cartMap} />
    </>
  );
}

function mapStateToProps(state) {
  const cartMap = {};
  state.carts.results.forEach(cart_item => {
    cartMap[cart_item.product.id] = cart_item.quantity;
  });
  return {
    products: state.products,
    cartMap
  };
}

const mapDispatchToProps = {
  loadProducts,
  loadCarts
};

function FilterableProductsTable({ products, cartMap }) {
  return <ProductTable products={products} cartMap={cartMap} />;
}

function ProductTable({ products, cartMap }) {
  const rows = [];
  products.forEach(product => {
    rows.push(
      <ProductRow
        key={product.id}
        product={product}
        initialQty={product.id in cartMap ? cartMap[product.id] : 0}
      />
    );
  });
  return (
    <>
      <Table striped hover>
        <thead />
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

function ProductRow({
  product: {
    name,
    id,
    supplier: { name: supplier_name },
    sku,
    unit,
    price
  },
  initialQty
}) {
  console.log("rendering product : " + name);
  const [qty, setQty] = useState(initialQty);

  function handleChange(event) {
    setQty(event.target.value);
  }

  return (
    <tr>
      <td>{name}</td>
      <td>{id}</td>
      <td>{supplier_name}</td>
      <td>{sku}</td>
      <td>{unit}</td>
      <td>{price}</td>
      <td>
        <InputGroup>
          <Input
            value={qty}
            placeholder="Qty"
            min={0}
            max={100}
            type="number"
            step="1"
            onChange={handleChange}
          />
        </InputGroup>
      </td>
    </tr>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaceOrderPage);
