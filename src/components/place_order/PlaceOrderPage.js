import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import { loadProducts } from "../../redux/actions/productActions";
import { loadCarts } from "../../redux/actions/cartActions";
import { InputGroup, Input } from "reactstrap";

function PlaceOrderPage({
  loadProducts,
  loadCarts,
  products: { results: product_list },
  carts: { results: cart_list }
}) {
  useEffect(() => {
    loadProducts();
    loadCarts();
  }, []);
  return (
    <>
      <h2>Place Order:</h2>
      <FilterableProductsTable products={product_list} />
    </>
  );
}

function mapStateToProps(state) {
  return {
    products: state.products,
    carts: state.carts
  };
}

const mapDispatchToProps = {
  loadProducts,
  loadCarts
};

function FilterableProductsTable({ products }) {
  return <ProductTable products={products} />;
}

function ProductTable({ products }) {
  const rows = [];
  products.forEach(product => {
    rows.push(<ProductRow key={product.id} product={product} />);
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

function handleChange(event) {
  alert("loda");
}

function ProductRow({
  product: {
    name,
    id,
    supplier: { name: supplier_name },
    sku,
    unit,
    price
  }
}) {
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
            value={10}
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
