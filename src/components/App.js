import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "./common/Header";

import OrdersPage from "./orders/OrdersPage";
import PlaceOrderPage from "./place_order/PlaceOrderPage";
import OrderDetailsPage from "./orders/OrderDetailsPage";
import OrderCheckInPage from "./checkin/OrderCheckInPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <Switch>
        <Route exact path="/" component={OrdersPage} />
        <Route path="/place_order" component={PlaceOrderPage} />
        <Route path="/orders/:id" component={OrderDetailsPage} />
        <Route path="/checkin/:id" component={OrderCheckInPage} />
      </Switch>
      <ToastContainer autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
