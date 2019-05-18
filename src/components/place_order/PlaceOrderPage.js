import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button } from "reactstrap";
import { loadProducts } from "../../redux/actions/productActions";
import { loadCarts, addCartItem } from "../../redux/actions/cartActions";
import { InputGroup, Input, Col, Row, Container } from "reactstrap";
import Cart from "./Cart";
import * as constants from "./constants";
import SpinnerWrapper from "../common/SpinnerWrapper";
import { toast } from "react-toastify";

function PlaceOrderPage({
  loadProducts,
  loadCarts,
  addCartItem,
  products: { results: product_list },
  cartMap,
  loading
}) {
  useEffect(() => {
    loadProducts();
    loadCarts();
  }, []);
  return (
    <>
      <h2>Place Order:</h2>
      {loading ? (
        <SpinnerWrapper />
      ) : (
        <Container>
          <Row>
            <Col lg="9">
              <FilterableProductsTable
                products={product_list}
                cartMap={cartMap}
                addCartItem={addCartItem}
              />
            </Col>
            <Col lg="3">
              <Cart />
            </Col>
          </Row>
        </Container>
      )}
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
    cartMap,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  loadProducts,
  loadCarts,
  addCartItem
};

function FilterableProductsTable({ products, cartMap, addCartItem }) {
  return (
    <ProductTable
      products={products}
      cartMap={cartMap}
      addCartItem={addCartItem}
    />
  );
}

function ProductTable({ products, cartMap, addCartItem }) {
  const rows = [];
  products.forEach(product => {
    rows.push(
      <ProductRow
        key={product.id}
        product={product}
        initialQty={product.id in cartMap ? cartMap[product.id] : 0}
        addCartItem={addCartItem}
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
    supplier: { id: supplier_id, name: supplier_name },
    sku,
    unit,
    price
  },
  initialQty,
  addCartItem
}) {
  const initialButton = constants.CART_ADD;
  const [qty, setQty] = useState(initialQty);
  const [button, setButton] = useState(initialButton);

  // looks like the inital state setting is async and you need to add this
  useEffect(() => {
    setQty(initialQty);
    if (initialQty > 0) {
      setButton(constants.CART_ADDED);
    } else {
      setButton(initialButton);
    }
  }, [initialQty]);

  useEffect(() => {
    if (initialQty > 0) {
      if (qty == initialQty) {
        setButton(constants.CART_ADDED);
      } else {
        setButton(constants.CART_UPDATE);
      }
    }
  }, [qty]);

  function handleChange(event) {
    const { name, value } = event.target;
    // don't allow an existing cart item quantity to be reduced to 0
    if (value == 0) {
      return;
    }
    setQty(value);
  }

  function handleAddingToCart(event) {
    event.preventDefault();
    if (button === constants.CART_ADD) {
      addCartItem(id, supplier_id, qty)
        .then(() => {
          console.log(toast);
          toast.success("Added to cart");
        })
        .catch(the_error => {
          toast.error(the_error);
        });
    }
  }

  return (
    <tr>
      <td>
        {supplier_name}
        <br />
        <b className="text-primary">{name}</b>
        <br />
        SKU: {sku}
        <br />
        &#8377; {price}/{unit}
      </td>
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
      <td>
        <Button color={button.colour} onClick={handleAddingToCart} block>
          {button.text}
        </Button>
      </td>
    </tr>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaceOrderPage);
