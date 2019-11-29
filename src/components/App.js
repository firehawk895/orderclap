import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "./common/Header";

import OrdersPage from "./orders/OrdersPage";
import PlaceOrderPage from "./place_order/PlaceOrderPage";
import OrderDetailsPage from "./orders/OrderDetailsPage";
import OrderCheckInPage from "./checkin/OrderCheckInPage";
import { ToastContainer } from "react-toastify";
import { Container } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import CheckoutPage from "./place_order/CheckoutPage";
import VendorOrderDetailsPage from "./orders/VendorOrderDetails";

function App() {
  return (
    <Container fluid>
      <Header />
      <Switch>
        <Route exact path="/" component={OrdersPage} />
        <Route path="/place_order" component={PlaceOrderPage} />
        <Route path="/orders/:id" component={OrderDetailsPage} />
        <Route path="/vendors/orders/:id" component={VendorOrderDetailsPage} />
        <Route path="/checkin/:id" component={OrderCheckInPage} />
        <Route path="/checkout" component={CheckoutPage} />
      </Switch>
      <ToastContainer autoClose={3000} hideProgressBar />
    </Container>
  );
}

export default App;
