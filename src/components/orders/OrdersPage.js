import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { connect } from "react-redux";
import { loadOrders } from "../../redux/actions/orderActions";

function OrdersPage({ loadOrders, orders: { results: order_list } }) {
  useEffect(() => {
    loadOrders();
  }, []);
  return (
    <>
      <h2>Order History</h2>
      <FilterableOrdersTable orders={order_list} />
    </>
  );
}

function mapStateToProps(state) {
  return {
    orders: state.orders
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
          <th>Total</th>
          <th>Invoice #</th>
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
    amount,
    invoice_no
  }
}) {
  return (
    <tr>
      <td>{status}</td>
      <td>{id}</td>
      <td>{supplier_name}</td>
      <td>{created_at}</td>
      <td>{amount}</td>
      <td>{invoice_no}</td>
    </tr>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersPage);
