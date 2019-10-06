import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button, Alert } from "reactstrap";
import { loadProducts } from "../../redux/actions/productActions";
import {
  loadCarts,
  addCartItem,
  updateCartItem
} from "../../redux/actions/cartActions";
import { InputGroup, Input, Col, Row, Container } from "reactstrap";
import Cart from "./Cart";
import * as constants from "./constants";
import SpinnerWrapper from "../common/SpinnerWrapper";
import { toast } from "react-toastify";
import { errorToaster, simpleErrorToaster, filterList } from "../../utils";

function PlaceOrderPage({
  loadProducts,
  loadCarts,
  addCartItem,
  updateCartItem,
  products: { results: product_list },
  cartMap,
  loading
}) {
  const [errors, setErrors] = useState("");
  useEffect(() => {
    Promise.all([loadProducts(), loadCarts()]).catch(the_error =>
      setErrors(the_error.message)
    );
  }, []);
  return (
    <>
      <h2>Place Order:</h2>
      {loading ? (
        <SpinnerWrapper />
      ) : errors ? (
        <Alert color="danger">{errors}</Alert>
      ) : (
        <Container>
          <Row>
            <Col lg="9">
              <FilterableProductsTable
                products={product_list}
                cartMap={cartMap}
                addCartItem={addCartItem}
                updateCartItem={updateCartItem}
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
    cartMap[cart_item.product.id] = {
      quantity: cart_item.quantity,
      cartItemId: "id" in cart_item ? cart_item.id : null
    };
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
  addCartItem,
  updateCartItem
};

function FilterableProductsTable({
  products,
  cartMap,
  addCartItem,
  updateCartItem
}) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  function handleChange(event) {
    const { name, value } = event.target;
    setSearchText(value);
    if (value) {
      setFilteredProducts(
        filterList(value, products, [
          "name",
          "sku",
          "description",
          "supplier.name"
        ])
      );
    } else {
      setFilteredProducts(products);
    }
  }

  return (
    <>
      <Input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={handleChange}
      />
      <ProductTable
        products={filteredProducts}
        cartMap={cartMap}
        addCartItem={addCartItem}
        updateCartItem={updateCartItem}
      />
    </>
  );
}

function ProductTable({ products, cartMap, addCartItem, updateCartItem }) {
  const rows = [];
  products.forEach(product => {
    rows.push(
      <ProductRow
        key={product.id}
        product={product}
        initialQty={product.id in cartMap ? cartMap[product.id].quantity : 0}
        addCartItem={addCartItem}
        cartItemId={
          product.id in cartMap ? cartMap[product.id].cartItemId : null
        }
        updateCartItem={updateCartItem}
      />
    );
  });
  return (
    <>
      <Table striped hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th />
          </tr>
        </thead>
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
  cartItemId,
  addCartItem,
  updateCartItem
}) {
  const [qty, setQty] = useState(initialQty);
  const [button, setButton] = useState(constants.CART_ADD);

  // looks like the inital state setting is async and you need to add this
  useEffect(() => {
    setQty(initialQty);
    if (initialQty > 0) {
      setButton(constants.CART_ADDED);
    } else {
      setButton(constants.CART_ADD);
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
    setQty(value);
  }

  function handleAddingToCart(event) {
    event.preventDefault();
    if (qty) {
      if (button === constants.CART_ADD) {
        addCartItem(id, supplier_id, qty)
          .then(() => {
            toast.success("Added to cart");
          })
          .catch(the_error => {
            errorToaster(the_error.message);
          });
      } else if (button === constants.CART_UPDATE) {
        updateCartItem(cartItemId, qty)
          .then(() => {
            toast.success("Cart Item Updated.");
          })
          .catch(the_error => {
            errorToaster(the_error.message);
          });
      }
    } else {
      setQty(initialQty);
      simpleErrorToaster("Please enter a valid quantity > 0");
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
