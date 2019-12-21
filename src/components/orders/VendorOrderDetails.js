import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, Col, Row, Button, Table, Alert } from "reactstrap";
import { connect } from "react-redux";
import { STATUSES } from "./constants";
import { loadOrderDetails, patchOrder } from "../../redux/actions/orderActions";
import SpinnerWrapper from "../common/SpinnerWrapper";
import DeleteModal from "../common/DeleteModal";
import {
  is8601_to_readable,
  is8601_to_readable_date,
  isEmptyObject
} from "../../utils";
import { statusColourGenerator } from "../../utils";

function VendorOrderDetailsPage({
  match,
  loadOrderDetails,
  loading,
  orderDetails,
  patchOrder
}) {
  const orderId = match.params.id;
  const [errors, setErrors] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  useEffect(() => {
    loadOrderDetails(orderId).catch(the_error => setErrors(the_error.message));
  }, []);
  return (
    <>
      <DeleteModal
        open={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        deleterThunk={() =>
          patchOrder(orderId, { status: STATUSES.REJECTED, is_vendor: true })
        }
        successToastMessage="Order has been rejected!"
      />
      {!isEmptyObject(orderDetails) && (
        <Link to={"/vendors/" + orderDetails.supplier.slug}>
          <Button block color="primary">
            Go to Order History
          </Button>
        </Link>
      )}
      <h2>Order Details: </h2>
      {loading ? (
        <SpinnerWrapper />
      ) : errors ? (
        <Alert color="danger">{errors}</Alert>
      ) : (
        <>
          <Row>
            <Col md="12">
              {!isEmptyObject(orderDetails) && (
                <InvoiceCard orderDetails={orderDetails} />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              {orderDetails.status === STATUSES.SUBMITTED && (
                <>
                  <Button
                    color="success"
                    onClick={() =>
                      patchOrder(orderId, {
                        status: STATUSES.ACCEPTED,
                        is_vendor: true
                      })
                    }
                    size="lg"
                    block
                  >
                    Accept Order
                  </Button>
                  <Button
                    color="danger"
                    size="lg"
                    onClick={() => setDeleteModalOpen(true)}
                    block
                  >
                    Reject Order
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </>
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
    <>
      <h2 className="text-primary">{supplier.name}</h2>
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
          Placed by: <br />
          <b>{restaurant.email}</b>
          <br />
          {checked_in_at && (
            <>
              Checked in by: <b>{restaurant.email}</b>
              <br />
              Checked in at: <b>{is8601_to_readable(checked_in_at)}</b>
            </>
          )}
          Received: <br />
          <b>{is8601_to_readable(created_at)}</b>
          <br />
          {}
          Status:
          <br />{" "}
          <Button color={statusColourGenerator(status)} disabled>
            {status}
          </Button>
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
                <td className="text-success text-right">&#8377; {amount}</td>
              </tr>
              <tr>
                {(status === STATUSES.CHECKED_IN ||
                  status == STATUSES.DELIVERED) && (
                  <>
                    <td>Check-in Total:</td>
                    <td className="text-right">&#8377; {amount_checked_in}</td>
                  </>
                )}
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}

function OrderItemRow({ orderItem: { quantity, amount, product } }) {
  return (
    <Card>
      <CardHeader>
        <Row>
          <Col>
            <h4 className="text-primary">{product.name}</h4>
          </Col>
          <Col className="text-right">&#8377; {amount}</Col>
        </Row>
        <Row>
          <Col>SKU: {product.sku}</Col>
          <Col className="text-right">qty: {quantity}</Col>
        </Row>
        <Row>
          <Col>
            &#8377; {product.price}/{product.unit}
          </Col>
          <Col></Col>
        </Row>
      </CardHeader>
    </Card>
  );
}

function InvoiceTable({ order_items }) {
  const rows = [];
  order_items.forEach(item => {
    rows.push(<OrderItemRow key={item.id} orderItem={item} />);
  });
  return <>{rows}</>;
}

function OrderItemCheckedInRow({
  orderItem: { quantity, qty_received, status, product }
}) {
  return (
    <Card>
      <CardHeader>
        <Row>
          <Col>
            <h4 className="text-primary">{product.name}</h4>
          </Col>
          <Col className="text-right">
            &#8377; {qty_received * product.price}
          </Col>
        </Row>
        <Row>
          <Col>SKU: {product.sku}</Col>
          <Col className="text-right">ord: {quantity}</Col>
        </Row>
        <Row>
          <Col>
            &#8377; {product.price}/{product.unit}
          </Col>
          <Col className="text-right">rcd: {qty_received}</Col>
        </Row>
        <Row>
          <Col>{status}</Col>
          <Col></Col>
        </Row>
      </CardHeader>
    </Card>
  );
}

function InvoiceTableCheckedIn({ order_items }) {
  const rows = [];
  order_items.forEach(item => {
    rows.push(<OrderItemCheckedInRow key={item.id} orderItem={item} />);
  });
  return <>{rows}</>;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VendorOrderDetailsPage);
