import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import { loadProducts } from "../../redux/actions/productActions";
import { InputGroup, Input } from "reactstrap";

function PlaceOrderPage({ loadProducts, products: { results: product_list } }) {
  useEffect(() => {
    loadProducts();
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
    products: state.products
  };
}

const mapDispatchToProps = {
  loadProducts
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
          <Input placeholder="Qty" min={0} max={100} type="number" step="1" />
        </InputGroup>
      </td>
    </tr>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaceOrderPage);
