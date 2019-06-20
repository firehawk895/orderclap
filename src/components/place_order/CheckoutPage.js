import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  deleteCartItem,
  updateCartItem,
  loadCarts,
  deleteCartBySuppliers
} from "../../redux/actions/cartActions";
import { sendOrders } from "../../redux/actions/sendOrdersActions";
import DeleteModal from "../common/DeleteModal";
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
  deleteCartBySuppliers,
  loading,
  loadCarts,
  sendOrders
}) {
  const [errors, setErrors] = useState("");
  // This state map maintains all delivery date data from its children components
  // to be later included in the send orders API
  const [supplier_formdata_map, setSupplierFormMap] = useState({});
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
        deleteCartBySuppliers={deleteCartBySuppliers}
        setSupplierFormMap={setSupplierFormMap}
        sendOrders={sendOrders}
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
              <CheckoutSummary
                supplier_map={supplier_map}
                deleteCartBySuppliers={deleteCartBySuppliers}
                supplier_formdata_map={supplier_formdata_map}
                sendOrders={sendOrders}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    supplier_map: getSupplierMap(state.carts),
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  deleteCartItem,
  updateCartItem,
  loadCarts,
  deleteCartBySuppliers,
  sendOrders
};

function SupplierRow({
  supplier,
  cartItems,
  total,
  deleteCartItem,
  updateCartItem,
  deleteCartBySuppliers,
  setSupplierFormMap,
  sendOrders
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState();

  function toggleCollapse() {
    setIsCollapsed(prevState => !prevState);
  }

  function handleDateChange(event) {
    const { name, value } = event.target;
    setDeliveryDate(value);
    setSupplierFormMap(prevState => {
      const newMap = { ...prevState };
      newMap[supplier.id] = value;
      return newMap;
    });
  }

  function handlePlaceOrder(event) {
    const orderobj = getOrderObject(supplier.id, deliveryDate, cartItems);
    sendOrders([orderobj])
      .then(() => toast.success("Order has been sent to supplier"))
      .catch(the_error => {
        errorToaster(the_error.message);
        toast.error("Try refreshing the page or contact +91-9643713143");
      });
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
                  onChange={handleDateChange}
                />
              </Form>
            </Col>
            <Col lg="2">
              <Button
                className="float-right"
                color="success"
                onClick={handlePlaceOrder}
              >
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
                    deleteCartItem={deleteCartItem}
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
              <Button color="danger" onClick={() => setDeleteModalOpen(true)}>
                Remove Order
              </Button>
              <DeleteModal
                open={deleteModalOpen}
                setModalOpen={setDeleteModalOpen}
                deleterThunk={() => deleteCartBySuppliers([supplier.id])}
                successToastMessage="Supplier's items deleted"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

function CartItemTable({ cartItems, updateCartItem, deleteCartItem }) {
  const rows = [];
  cartItems.forEach(cartItem => {
    rows.push(
      <CartItemRow
        key={cartItem.id}
        cartItem={cartItem}
        updateCartItem={updateCartItem}
        deleteCartItem={deleteCartItem}
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

function CartItemRow({ cartItem, updateCartItem, deleteCartItem }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
        <Button onClick={() => setDeleteModalOpen(true)}>Remove</Button>
        <DeleteModal
          open={deleteModalOpen}
          setModalOpen={setDeleteModalOpen}
          deleterThunk={() => deleteCartItem(cartItem.id)}
          successToastMessage="Cart Item Deleted."
        />
      </td>
      <td>
        <b>&#8377; {cartItem.product.price * cartItem.quantity}</b>
      </td>
    </tr>
  );
}

function CheckoutSummary({
  supplier_map,
  deleteCartBySuppliers,
  supplier_formdata_map,
  sendOrders
}) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  let total_order_value = 0;
  for (let key in supplier_map) {
    total_order_value += supplier_map[key].total;
  }

  function handleSendOrders() {
    const orders = [];
    for (let supplier_id in supplier_map) {
      orders.push(
        getOrderObject(
          supplier_id,
          supplier_formdata_map[supplier_id],
          supplier_map[supplier_id].cart_items
        )
      );
    }
    sendOrders(orders)
      .then(() => toast.success("All Orders have been sent to supplier!"))
      .catch(the_error => {
        errorToaster(the_error.message);
        toast.error("Try refreshing the page or contact +91-9643713143");
      });
  }

  return (
    <Row>
      <Col>
        <Card>
          <CardHeader>Checkout Summary</CardHeader>
          <CardBody>
            All Orders:
            <div className="float-right">&#8377; {total_order_value}</div>
            <br />
            Delivery: <div className="float-right">&#8377; 0</div>
            <br />
            <b>
              Total:{" "}
              <div className="float-right">&#8377; {total_order_value}</div>
            </b>
            <Button
              className="mt-4"
              color="success"
              block
              onClick={handleSendOrders}
            >
              Send Orders
            </Button>
            <Button
              color="danger"
              block
              onClick={() => setDeleteModalOpen(true)}
            >
              Remove All Orders
            </Button>
            <DeleteModal
              open={deleteModalOpen}
              setModalOpen={setDeleteModalOpen}
              deleterThunk={() =>
                deleteCartBySuppliers(
                  Object.keys(supplier_map).map(key => parseInt(key))
                )
              }
              successToastMessage="All items Removed"
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

/*
This is a helper to create an object to send for the Place Order API
*/
function getOrderObject(supplierId, deliveryDate, cartItems) {
  return {
    supplier: supplierId,
    req_dd: deliveryDate,
    cart_items: cartItems.map(function(cartItem) {
      return {
        id: cartItem.id,
        product: cartItem.product.id,
        quantity: cartItem.quantity
      };
    })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutPage);
