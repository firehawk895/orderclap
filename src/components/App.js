import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

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
import VendorOrdersPage from "./orders/VendorOrdersPage";

// As the number of routes increase, the pathname check will not scale
function App(props) {
  return (
    <Container fluid>
      {props.location.pathname == "/" ||
      props.location.pathname.includes("/vendors") ? (
        ""
      ) : (
        <Header />
      )}
      <Switch>
        <Route exact path="/crustos" component={OrdersPage} />
        <Route path="/place_order" component={PlaceOrderPage} />
        <Route path="/orders/:id" component={OrderDetailsPage} />
        <Route path="/vendors/orders/:id" component={VendorOrderDetailsPage} />
        <Route path="/vendors/:slug" component={VendorOrdersPage} />
        <Route path="/checkin/:id" component={OrderCheckInPage} />
        <Route path="/checkout" component={CheckoutPage} />
      </Switch>
      <ToastContainer autoClose={3000} hideProgressBar />
    </Container>
  );
}

export default withRouter(App);
