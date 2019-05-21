import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  deleteCartItem,
  updateCartItem,
  loadCarts
} from "../../redux/actions/cartActions";
import { getSupplierMap } from "./selectors";
import { Link } from "react-router-dom";
import SpinnerWrapper from "../common/SpinnerWrapper";
import {
  Alert,
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Collapse,
  Form,
  Input,
  InputGroup,
  Table
} from "reactstrap";
import { toast } from "react-toastify";
import { errorToaster } from "../../utils";

function CheckoutPage({
  supplier_map,
  deleteCartItem,
  updateCartItem,
  loading,
  loadCarts,
  total_order_value
}) {
  const [errors, setErrors] = useState("");
  useEffect(() => {
    loadCarts().catch(the_error => setErrors(the_error.message));
  }, []);
  const supplier_row_list = [];
  for (let supplier_id in supplier_map) {
    supplier_row_list.push(
      <SupplierRow
        key={supplier_id}
        supplier={supplier_map[supplier_id].supplier}
        cartItems={supplier_map[supplier_id].cart_items}
        total={supplier_map[supplier_id].total}
        deleteCartItem={deleteCartItem}
        updateCartItem={updateCartItem}
      />
    );
  }
  return (
    <>
      <h2>Checkout:</h2>
      {loading ? (
        <SpinnerWrapper />
      ) : errors ? (
        <Alert color="danger">{errors}</Alert>
      ) : (
        <Container>
          <Row>
            <Col lg="9">{supplier_row_list}</Col>
            <Col lg="3">
              <CheckoutSummary total={total_order_value} />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

function mapStateToProps(state) {
  const supplier_map = getSupplierMap(state.carts);
  // haan bsdk reducer likho
  let total_order_value = 0;
  for (let key in supplier_map) {
    total_order_value += supplier_map[key].total;
  }
  return {
    supplier_map,
    loading: state.apiCallsInProgress > 0,
    total_order_value
  };
}

const mapDispatchToProps = {
  deleteCartItem,
  updateCartItem,
  loadCarts
};

function SupplierRow({
  supplier,
  cartItems,
  total,
  deleteCartItem,
  updateCartItem
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function toggleCollapse() {
    setIsCollapsed(prevState => !prevState);
  }
  return (
    <>
      <Card>
        <CardHeader>
          {supplier.name}
          <div className="float-right">Total: &#8377; {total}</div>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg="2">
              <Button color="primary" onClick={toggleCollapse} className="mb-2">
                Show {cartItems.length} Item(s)
              </Button>
            </Col>
            <Col lg="8" className="d-flex justify-content-center">
              <Form inline>
                Delivery Date:&nbsp;
                <Input
                  type="date"
                  name="date"
                  id="exampleDate"
                  placeholder="delivery date"
                />
              </Form>
            </Col>
            <Col lg="2">
              <Button className="float-right" color="success">
                Place Order
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Collapse isOpen={isCollapsed}>
                <Card>
                  <CartItemTable
                    cartItems={cartItems}
                    updateCartItem={updateCartItem}
                  />
                </Card>
              </Collapse>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Link to="/place_order" style={{ textDecoration: "none" }}>
                <Button color="primary">Add Products</Button>
              </Link>
            </Col>
            <Col>
              <Button color="danger">Remove Order</Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

function CartItemTable({ cartItems, updateCartItem }) {
  const rows = [];
  cartItems.forEach(cartItem => {
    rows.push(
      <CartItemRow
        key={cartItem.id}
        cartItem={cartItem}
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
            <th>Total</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

function CartItemRow({ cartItem, updateCartItem }) {
  const hiddenButton = {
    hidden: true,
    text: ""
  };
  const updateButton = {
    hidden: false,
    text: "Update"
  };
  const [button, setButton] = useState(hiddenButton);
  const [qty, setQty] = useState(cartItem.quantity);

  useEffect(() => {
    setQty(cartItem.quantity);
  }, [cartItem.quantity]);

  useEffect(() => {
    if (qty == cartItem.quantity) {
      setButton(hiddenButton);
    } else {
      setButton(updateButton);
    }
  }, [qty, cartItem.quantity]);

  function handleChange(event) {
    const { name, value } = event.target;
    // don't allow an existing cart item quantity to be reduced to 0
    if (value == 0) {
      return;
    }
    setQty(value);
  }

  function handleUpdatingCart(event) {
    updateCartItem(cartItem.id, qty)
      .then(() => {
        toast.success("Cart Item Updated.");
      })
      .catch(the_error => {
        errorToaster(the_error.message);
      });
  }

  return (
    <tr>
      <td>
        {cartItem.supplier.name}
        <br />
        <b className="text-primary">{cartItem.product.name}</b>
        <br />
        SKU: {cartItem.product.sku}
        <br />
        &#8377; {cartItem.product.price}/{cartItem.product.unit}
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
        <Button
          hidden={button.hidden}
          color="success"
          onClick={handleUpdatingCart}
        >
          {button.text}
        </Button>
      </td>
      <td>
        <Button>Remove</Button>
      </td>
      <td>
        <b>&#8377; {cartItem.product.price * cartItem.quantity}</b>
      </td>
    </tr>
  );
}

function CheckoutSummary({ total }) {
  return (
    <Row>
      <Col>
        <Card>
          <CardHeader>Checkout Summary</CardHeader>
          <CardBody>
            All Orders:
            <div className="float-right">&#8377; {total}</div>
            <br />
            Delivery: <div className="float-right">&#8377; 0</div>
            <br />
            <b>
              Total: <div className="float-right">&#8377; {total}</div>
            </b>
            <Button className="mt-4" color="success" block>
              Send Orders
            </Button>
            <Button color="danger" block>
              Remove All Orders
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutPage);