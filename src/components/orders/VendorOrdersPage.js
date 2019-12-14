import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { loadOrders } from "../../redux/actions/orderActions";
import { is8601_to_readable, is8601_to_readable_date } from "../../utils";
import SpinnerWrapper from "../common/SpinnerWrapper";
import { filterList } from "../../utils";
import { STATUSES } from "./constants";

/* Maybe you can refactor the usage of history, which in fact is quite tatti,
to using the link component or atleast pass down hostory as a reference, and not super prop drilling */

function VendorOrdersPage({
  match,
  loadOrders,
  orders: { results: order_list },
  loading,
  history
}) {
  const slug = match.params.slug;
  const [errors, setErrors] = useState("");
  useEffect(() => {
    loadOrders({ supplier__slug: slug }).catch(the_error =>
      setErrors(the_error.message)
    );
  }, []);
  return (
    <>
      <h2>Order History</h2>
      {loading ? (
        <SpinnerWrapper />
      ) : errors ? (
        <Alert color="danger">{errors}</Alert>
      ) : (
        <FilterableOrdersTable orders={order_list} history={history} />
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    orders: state.orders,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  loadOrders
};

function FilterableOrdersTable({ orders, history }) {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  function handleChange(event) {
    const { name, value } = event.target;
    setSearchText(value);
    if (value) {
      setFilteredOrders(
        filterList(value, orders, ["supplier.name", "invoice_no"])
      );
    } else {
      setFilteredOrders(orders);
    }
  }

  return (
    <>
      <Input
        type="text"
        placeholder="Search invoice number..."
        value={searchText}
        onChange={handleChange}
      />
      <OrderTable orders={filteredOrders} history={history} />
    </>
  );
}

function OrderTable({ orders, history }) {
  const rows = [];
  orders.forEach(order => {
    rows.push(<OrderRow key={order.id} order={order} history={history} />);
  });
  return <>{rows}</>;
}

function OrderRow({
  order: {
    status,
    id,
    supplier: { name: supplier_name },
    created_at,
    requested_delivery_date,
    amount_checked_in,
    amount,
    invoice_no,
    restaurant: { name: restaurant_name }
  },
  history
}) {
  function handleRowClick(event) {
    const { name, value } = event.target;
    console.log(name);
    const order_details_route = "/orders/" + id;
    history.push(order_details_route);
  }

  let status_class = "";
  if (status === STATUSES.CHECKED_IN) {
    status_class = "primary";
  } else if (status === STATUSES.REJECTED) {
    status_class = "danger";
  } else if (status === STATUSES.DELIVERED) {
    status_class = "success";
  } else if (status === STATUSES.SUBMITTED) {
    status_class = "warning";
  } else if (status === STATUSES.ACCEPTED) {
    status_class = "info";
  }

  return (
    <Link to={"/vendors/orders/" + id}>
      <Card>
        <CardHeader>
          <Row>
            <Col>
              <b>Order #{id}</b>
            </Col>
            <Col className="text-right">{is8601_to_readable(created_at)}</Col>
          </Row>
          <Row>
            <Col>
              <b className="text-primary">{restaurant_name}</b>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              &#8377;{" "}
              {status === STATUSES.DELIVERED || status === STATUSES.CHECKED_IN
                ? amount_checked_in
                : amount}
            </Col>
            <Col className="text-right">
              <Button color={status_class} disabled>
                {status}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              {requested_delivery_date && (
                <>
                  Deliver by: {is8601_to_readable_date(requested_delivery_date)}
                </>
              )}
            </Col>
            <Col></Col>
          </Row>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VendorOrdersPage);
