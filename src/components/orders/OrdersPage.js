import React, { useEffect } from "react";
import { Table } from "reactstrap";
import { connect } from "react-redux";
import { loadOrders } from "../../redux/actions/orderActions";
import { Button } from "reactstrap";
import { is8601_to_readable } from "../../utils";
import SpinnerWrapper from "../common/SpinnerWrapper";

/* Maybe you can refactor the usage of history, which in fact is quite tatti,
to using the link component or atleast pass down hostory as a reference, and not super prop drilling */

function OrdersPage({
  loadOrders,
  orders: { results: order_list },
  loading,
  history
}) {
  useEffect(() => {
    loadOrders();
  }, []);
  return (
    <>
      <h2>Order History</h2>
      {loading ? (
        <SpinnerWrapper />
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
  return <OrderTable orders={orders} history={history} />;
}

function OrderTable({ orders, history }) {
  const rows = [];
  orders.forEach(order => {
    rows.push(<OrderRow key={order.id} order={order} history={history} />);
  });
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Status</th>
          <th>Order #</th>
          <th>Supplier</th>
          <th>Date</th>
          <th>Delivers On</th>
          <th>Total</th>
          <th>Invoice #</th>
          <th>Check-In</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

function OrderRow({
  order: {
    status,
    id,
    supplier: { name: supplier_name },
    created_at,
    requested_delivery_date,
    amount,
    invoice_no
  },
  history
}) {
  function handleRowClick(event) {
    const { name, value } = event.target;
    // make sure to supress this handler if the check in button is clicked
    if (name === "check-in button") {
      return;
    } else {
      const order_details_route = "/orders/" + id;
      history.push(order_details_route);
    }
  }

  function handleCheckinClick(event) {
    const order_checkin_route = "/checkin/" + id;
    history.push(order_checkin_route);
  }

  let buttonText = "Check-In";
  if (status === "Checked-In") {
    buttonText = "Edit Check-In";
  }
  const styles = {
    cursor: "pointer"
  };

  return (
    <tr onClick={handleRowClick} style={styles}>
      <td>{status}</td>
      <td>{id}</td>
      <td>{supplier_name}</td>
      <td>{is8601_to_readable(created_at)}</td>
      <td>{is8601_to_readable(requested_delivery_date)}</td>
      <td>&#8377; {amount}</td>
      <td>{invoice_no}</td>
      <td>
        <Button
          name="check-in button"
          color="primary"
          block
          onClick={handleCheckinClick}
        >
          {buttonText}
        </Button>
      </td>
    </tr>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersPage);
