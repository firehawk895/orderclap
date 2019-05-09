import React, { Component } from "react";
import { Table } from "reactstrap";
import { connect } from "react-redux";
import * as productActions from "../../redux/actions/productActions";
import { bindActionCreators } from "redux";

class Products extends Component {
  render() {
    return <div />;
  }
}

function mapStateToProps(state) {
  return {
    products: state.products
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadOrders: bindActionCreators(productActions.loadProducts, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Products);
