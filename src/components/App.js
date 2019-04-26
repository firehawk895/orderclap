import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "./common/Header";

import OrdersPage from "./orders/OrdersPage";
import PlaceOrderPage from "./place_order/PlaceOrderPage";

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <Switch>
        <Route exact path="/" component={OrdersPage} />
        <Route path="/place_order" component={PlaceOrderPage} />
      </Switch>
    </div>
  );
}

export default App;
