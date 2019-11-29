import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Table,
  FormGroup,
  Label,
  Input,
  InputGroup,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import { PAYMENT_STATUSES, STATUSES } from "./constants";
import { loadOrderDetails, patchOrder } from "../../redux/actions/orderActions";
import SpinnerWrapper from "../common/SpinnerWrapper";
import {
  is8601_to_readable,
  is8601_to_readable_date,
  isEmptyObject
} from "../../utils";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function VendorOrderDetailsPage({
  match,
  loadOrderDetails,
  loading,
  orderDetails,
  patchOrder
}) {
  const orderId = match.params.id;
  const [errors, setErrors] = useState("");
  useEffect(() => {
    loadOrderDetails(orderId).catch(the_error => setErrors(the_error.message));
  }, []);
  return (
    <>
      <h2>Order Details: </h2>
      {loading ? (
        <SpinnerWrapper />
      ) : errors ? (
        <Alert color="danger">{errors}</Alert>
      ) : (
        <Row>
          <Col md="12">
            {!isEmptyObject(orderDetails) && (
              <InvoiceCard orderDetails={orderDetails} />
            )}
          </Col>
          {/* <Col lg="4">
            {!isEmptyObject(orderDetails) && (
              <OrderSummary
                orderDetails={orderDetails}
                patchOrder={patchOrder}
              />
            )}
          </Col> */}
        </Row>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    orderDetails: state.orderDetails,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  loadOrderDetails,
  patchOrder
};

function InvoiceCard({
  orderDetails: {
    supplier,
    invoice_no,
    id,
    requested_delivery_date,
    created_at,
    restaurant,
    checked_in_at,
    status,
    order_items,
    amount,
    amount_checked_in
  }
}) {
  return (
    <Card>
      <CardBody>
        <h2 className="text-primary text-center">{supplier.name}</h2>
        <Row>
          <Col>
            <b>Order #{id}</b>
            <br />
            {invoice_no && (
              <>
                {supplier.name} Invoice Number: <b>{invoice_no}</b>
                <br />
              </>
            )}
            {requested_delivery_date && (
              <>
                Requested Delivery Date:{" "}
                <b>{is8601_to_readable_date(requested_delivery_date)}</b>
                <br />
              </>
            )}
            <br />
            Placed by: <b>{restaurant.email}</b>
            <br />
            {checked_in_at && (
              <>
                Checked in by: <b>{restaurant.email}</b>
                <br />
                Checked in at: <b>{is8601_to_readable(checked_in_at)}</b>
              </>
            )}
          </Col>
          <Col className="text-right">
            Received: <br />
            <b>{is8601_to_readable(created_at)}</b>
          </Col>
        </Row>
        <br />
        <br />
        {status === STATUSES.CHECKED_IN || status === STATUSES.DELIVERED ? (
          <InvoiceTableCheckedIn order_items={order_items} />
        ) : (
          <InvoiceTable order_items={order_items} />
        )}
        <Row>
          <Col lg="8" />
          <Col>
            <Table responsive striped>
              <tbody>
                {
                  // Don't need this until delivery charge kicks in as a use case
                  /* <tr>
                  <td>Sub Total:</td>
                  <td>&#8377; {amount}</td>
                  </tr> */
                }
                {/* <tr>
                  <td>Delivery Charge:</td>
                  <td>&#8377; TBD</td>
                </tr> */}
                <tr>
                  <td>PO Total:</td>
                  <td className="text-success">&#8377; {amount}</td>
                </tr>
                <tr>
                  {(status === STATUSES.CHECKED_IN ||
                    status == STATUSES.DELIVERED) && (
                    <>
                      <td>Check-in Total:</td>
                      <td>&#8377; {amount_checked_in}</td>
                    </>
                  )}
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

function OrderItemRow({ orderItem: { quantity, amount, product } }) {
  return (
    <tr>
      <td>{quantity}</td>
      <td>
        <b className="text-primary">{product.name}</b>
        <br />
        SKU: {product.sku}
      </td>
      <td>
        &#8377; {product.price}/{product.unit}
      </td>
      <td>&#8377; {amount}</td>
    </tr>
  );
}

function InvoiceTable({ order_items }) {
  const rows = [];
  order_items.forEach(item => {
    rows.push(<OrderItemRow key={item.id} orderItem={item} />);
  });
  return (
    <Table striped responsive>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Product</th>
          <th>Price/Unit</th>
          <th>Total Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

function OrderItemCheckedInRow({
  orderItem: { quantity, qty_received, status, product }
}) {
  return (
    <tr>
      <td>
        Ordered: {quantity}
        <br />
        Received: {qty_received}
      </td>
      <td>{status}</td>
      <td>
        {product.name}
        <br />
        SKU: {product.sku}
      </td>
      <td>
        &#8377; {product.price}/{product.unit}
      </td>
      <td>&#8377; {qty_received * product.price}</td>
    </tr>
  );
}

function InvoiceTableCheckedIn({ order_items }) {
  const rows = [];
  order_items.forEach(item => {
    rows.push(<OrderItemCheckedInRow key={item.id} orderItem={item} />);
  });
  return (
    <Table responsive striped>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Status</th>
          <th>Product</th>
          <th>Price/Unit</th>
          <th>Total Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

function OrderSummary({
  orderDetails: { id, created_at, amount, invoice_no, payment_status, status },
  patchOrder
}) {
  const [paymentStatus, setPaymentStatus] = useState(payment_status);
  const [invoiceNo, setInvoiceNo] = useState(invoice_no);

  function handlePaymentChange(event) {
    let { name, value } = event.target;
    if (value == PAYMENT_STATUSES.NONE) {
      value = null;
    }
    setPaymentStatus(value);
    patchOrder(id, {
      payment_status: value
    });
    toast.success("Payment status changed!");
  }

  function handleFinalize() {
    patchOrder(id, {
      status: STATUSES.DELIVERED
    });
    toast.success("Order has been finalized!");
  }

  function handleInvoiceNoChange(event) {
    const { name, value } = event.target;
    setInvoiceNo(value);
  }

  function handleSave() {
    patchOrder(id, {
      invoice_no: invoiceNo
    });
    toast.success("Invoice number saved!");
  }

  return (
    <Card>
      <CardHeader>Order Summary</CardHeader>
      <CardBody className="d-flex flex-column">
        <div className="p-2">
          Order Date: <b>{is8601_to_readable(created_at)}</b>
        </div>
        <div className="p-2">Order Total: &#8377; {amount}</div>
        <div className="p-2">
          {status != STATUSES.DELIVERED && (
            <Link to={"/checkin/" + id} style={{ textDecoration: "none" }}>
              <Button color="primary" block>
                Check-In
              </Button>
            </Link>
          )}
        </div>
        <div className="p-2">
          {status == STATUSES.CHECKED_IN && (
            <Button color="danger" onClick={handleFinalize} block>
              Finalize Check-In
            </Button>
          )}
        </div>
        <hr />
        <div className="p-2">
          <FormGroup>
            <Label>Payment Status</Label>
            <Input
              type="select"
              onChange={handlePaymentChange}
              defaultValue={paymentStatus}
            >
              <option>{PAYMENT_STATUSES.NONE}</option>
              <option>{PAYMENT_STATUSES.INVOICE_RECEIVED}</option>
              <option>{PAYMENT_STATUSES.PAID_FULL}</option>
              <option>{PAYMENT_STATUSES.PAID_PARTIAL}</option>
              <option>{PAYMENT_STATUSES.DISPUTED}</option>
              <option>{PAYMENT_STATUSES.DUE}</option>
            </Input>
          </FormGroup>
        </div>
        <div className="p-2">
          <FormGroup>
            <Label>Invoice Number</Label>
            <InputGroup>
              <Input
                placeholder="Custom Invoice. No."
                value={invoiceNo}
                onChange={handleInvoiceNoChange}
              />
              <Button color="success" onClick={handleSave}>
                Save
              </Button>
            </InputGroup>
          </FormGroup>
        </div>
      </CardBody>
    </Card>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VendorOrderDetailsPage);
