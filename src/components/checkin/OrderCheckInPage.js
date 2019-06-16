import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Container,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Table,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  InputGroup,
  Alert
} from "reactstrap";
import { loadOrderDetails } from "../../redux/actions/orderActions";
import {
  is8601_to_readable,
  is8601_to_readable_date,
  isEmptyObject
} from "../../utils";

const CHECKIN_STATUSES = {
  MISSING: "Missing/Not Delivered",
  RECEIVED: "Received (Full)",
  RECEIVED_PARTIAL: "Received (Partial)",
  RETURNED: "Returned"
};

function OrderCheckInPage({ match, loadOrderDetails, orderDetails }) {
  const orderId = match.params.id;
  const [errors, setErrors] = useState("");
  useEffect(() => {
    loadOrderDetails(orderId).catch(the_error => setErrors(the_error.message));
  }, []);
  return (
    <>
      <h2>Order Check in Page</h2>
      <Container>
        <Row>
          <Col>
            {!isEmptyObject(orderDetails) && (
              <ProductTable orderDetails={orderDetails} />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

function ProductTable({
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
    amount
  }
}) {
  const rows = [];
  order_items.forEach(item => {
    rows.push(<OrderItemRow key={item.id} orderItem={item} />);
  });
  return (
    <>
      <Table striped className="text-center">
        <thead>
          <tr>
            <th>Received</th>
            <th>Qty Received / Ordered</th>
            <th>Status</th>
            <th>Unit</th>
            <th>Item Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

function StatusCheckBox({ checkinStatus, handleStatusCheckBoxClick }) {
  let className = "btn-circle btn-outline";
  let colour = "success";

  if (checkinStatus) {
    // remove the button outline
    className = "btn-circle";
    if (
      checkinStatus === CHECKIN_STATUSES.MISSING ||
      checkinStatus === CHECKIN_STATUSES.RETURNED
    ) {
      colour = "danger";
    } else if (checkinStatus == CHECKIN_STATUSES.RECEIVED) {
      colour = "success";
    } else if (checkinStatus == CHECKIN_STATUSES.RECEIVED_PARTIAL) {
      colour = "warning";
    }
  }
  return (
    <Button
      className={className}
      color={colour}
      onClick={handleStatusCheckBoxClick}
    >
      <i
        className="fa fa-2x fa-check"
        style={{ marginTop: "-3px", color: "white" }}
      />
    </Button>
  );
}

function OrderItemRow({
  orderItem: { quantity, qty_received, status, product }
}) {
  const [recdQty, setRecdQty] = useState();
  const [checkinStatus, setCheckinStatus] = useState();
  const [rqText, setRqText] = useState("");
  useEffect(() => {
    if (recdQty == 0) {
      setCheckinStatus(CHECKIN_STATUSES.MISSING);
    } else if (recdQty >= quantity) {
      setCheckinStatus(CHECKIN_STATUSES.RECEIVED);
    } else if (recdQty < quantity) {
      setCheckinStatus(CHECKIN_STATUSES.RECEIVED_PARTIAL);
    }
  }, [recdQty]);

  function handleStatusChange(event) {
    const { name, value } = event.target;
    setCheckinStatus(value);
  }

  function handleRecdQtyChange(event) {
    const { name, value } = event.target;
    setRecdQty(value);
  }

  return (
    <tr>
      <td className="align-middle">
        <StatusCheckBox
          checkinStatus={checkinStatus}
          handleStatusCheckBoxClick={() => {
            setRecdQty(quantity);
          }}
        />
      </td>
      <td className="align-middle">
        <InputGroup>
          {
            // value={recdQty || ""} this short circuit notation is used for the following reason:
            // https://stackoverflow.com/a/47012342/1881812
          }
          <Input
            min={0}
            step="1"
            type="number"
            onChange={handleRecdQtyChange}
            value={recdQty || ""}
            valid={null}
          />
          <div className="input-group-append">
            <Button disabled style={{ cursor: "default" }}>
              {" "}
              / {quantity}
            </Button>
          </div>
          <FormFeedback>{rqText}</FormFeedback>
        </InputGroup>
      </td>
      <td className="align-middle">
        <Input
          type="select"
          onChange={handleStatusChange}
          defaultValue=""
          value={checkinStatus}
        >
          <option />
          <option>{CHECKIN_STATUSES.RECEIVED}</option>
          <option>{CHECKIN_STATUSES.RECEIVED_PARTIAL}</option>
          <option>{CHECKIN_STATUSES.MISSING}</option>
          <option>{CHECKIN_STATUSES.RETURNED}</option>
        </Input>
        <FormFeedback>does not match with quantity</FormFeedback>
      </td>
      <td className="align-middle">{product.unit}</td>
      <td className="align-middle">{product.name}</td>
      <td className="align-middle">{product.sku}</td>
      <td className="align-middle">{product.price}</td>
      <td className="align-middle">
        {recdQty && <>&#8377; {recdQty * product.price}</>}
      </td>
    </tr>
  );
}

function mapStateToProps(state) {
  return {
    orderDetails: state.orderDetails,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  loadOrderDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderCheckInPage);
