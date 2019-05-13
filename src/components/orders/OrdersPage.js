import React, { useEffect, useState } from "react";
import { Table, Spinner } from "reactstrap";
import { connect } from "react-redux";
import { loadOrders } from "../../redux/actions/orderActions";
import { Button } from "reactstrap";
import { is8601_to_readable } from "../../utils";

function OrdersPage({ loadOrders, orders: { results: order_list }, loading }) {
  useEffect(() => {
    loadOrders();
  }, []);
  return (
    <>
      <h2>Order History</h2>
      {loading ? (
        <Spinner color="success" />
      ) : (
        <FilterableOrdersTable orders={order_list} />
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

function FilterableOrdersTable({ orders }) {
  return <OrderTable orders={orders} />;
}

function OrderTable({ orders }) {
  const rows = [];
  orders.forEach(order => {
    rows.push(<OrderRow key={order.id} order={order} />);
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
  }
}) {
  let buttonText = "Check-In";
  if (status === "Checked-In") {
    buttonText = "Edit Check-In";
  }
  //May 13, 2019 10:53:45 PM

  return (
    <tr>
      <td>{status}</td>
      <td>{id}</td>
      <td>{supplier_name}</td>
      <td>{is8601_to_readable(created_at)}</td>
      <td>{is8601_to_readable(requested_delivery_date)}</td>
      <td>&#8377; {amount}</td>
      <td>{invoice_no}</td>
      <td>
        <Button color="primary" block>
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
