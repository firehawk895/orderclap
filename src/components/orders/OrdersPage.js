import React from "react";
import { Table } from "reactstrap";
import Moment from "react-moment";

const ORDERS = [
  {
    id: 35150614,
    status: "checked-in",
    supplier: "Organo Fresh",
    order_placed: "20080915T155300",
    order_total: 3072,
    invoice_no: "1502"
  },
  {
    id: 35150614,
    status: "submitted",
    supplier: "Organo Fresh",
    order_placed: "20080915T155300",
    order_total: 3072,
    invoice_no: "1503"
  },
  {
    id: 35150614,
    status: "checked-in",
    supplier: "Ghoda Fresh",
    order_placed: "20080915T155300",
    order_total: 3072,
    invoice_no: "1504"
  },
  {
    id: 35150614,
    status: "checked-in",
    supplier: "Kaithal Fresh",
    order_placed: "20080915T155300",
    order_total: 3072,
    invoice_no: "1505"
  }
];

class OrderRow extends React.Component {
  render() {
    const order = this.props.order;
    const id = order.id;
    const status = order.status;
    const supplier = order.supplier;
    const order_placed = order.order_placed;
    const order_total = order.order_total;
    const invoice_no = order.invoice_no;
    return (
      <tr>
        <td>{status}</td>
        <td>{id}</td>
        <td>{supplier}</td>
        <td>
          <Moment format="YYYY-MM-DD HH:mm">{order_placed}</Moment>
        </td>
        <td>{order_total}</td>
        <td>{invoice_no}</td>
      </tr>
    );
  }
}

class OrderTable extends React.Component {
  render() {
    const rows = [];
    this.props.orders.forEach(order => {
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
}

class FilterableOrdersTable extends React.Component {
  render() {
    return <OrderTable orders={ORDERS} />;
  }
}

class OrdersPage extends React.Component {
  render() {
    return (
      <>
        <h2>Order History</h2>
        <FilterableOrdersTable orders={ORDERS} />
      </>
    );
  }
}

export default OrdersPage;
