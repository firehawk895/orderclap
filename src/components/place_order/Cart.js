import React, { useState } from "react";
import { connect } from "react-redux";
import { CardHeader, CardBody, Row, Col, Card, Button } from "reactstrap";
import { Link } from "react-router-dom";
import DeleteCartModal from "./DeleteCartModal";
import {
  deleteCartItem,
  updateCartItem
} from "../../redux/actions/cartActions";
import EditCartModal from "./EditCartModal";
import { getSupplierMap } from "./selectors";

function Cart({ supplier_map, deleteCartItem, updateCartItem }) {
  const cart_supplier_rows = [];
  for (let supplier_id in supplier_map) {
    cart_supplier_rows.push(
      <CartSupplierRow
        key={supplier_id}
        supplier={supplier_map[supplier_id].supplier}
        cartItems={supplier_map[supplier_id].cart_items}
        deleteCartItem={deleteCartItem}
        updateCartItem={updateCartItem}
      />
    );
  }
  return (
    <>
      <Link to="/checkout" style={{ textDecoration: "none" }}>
        <Button color="success" block>
          Go To Checkout
        </Button>
      </Link>
      {cart_supplier_rows}
    </>
  );
}

function mapStateToProps(state) {
  const supplier_map = getSupplierMap(state.carts);
  return {
    supplier_map
  };
}

const mapDispatchToProps = {
  deleteCartItem,
  updateCartItem
};

function CartSupplierRow({
  supplier,
  cartItems,
  deleteCartItem,
  updateCartItem
}) {
  const cart_item_rows = [];
  cartItems.forEach(cartItem => {
    cart_item_rows.push(
      <CartItemRow
        key={cartItem.id}
        cartItem={cartItem}
        deleteCartItem={deleteCartItem}
        updateCartItem={updateCartItem}
      />
    );
  });
  return (
    <>
      <Card>
        <CardHeader>{supplier.name}</CardHeader>
        {cart_item_rows}
      </Card>
    </>
  );
}

function CartItemRow({ cartItem, deleteCartItem, updateCartItem }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  return (
    <>
      <DeleteCartModal
        cartId={cartItem.id}
        open={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        deleteCartItem={deleteCartItem}
      />
      <EditCartModal
        open={editModalOpen}
        setModalOpen={setEditModalOpen}
        updateCartItem={updateCartItem}
        cartItem={cartItem}
      />
      <CardBody>
        <Row>
          <Col lg="9">
            <div className="h5">{cartItem.product.name}</div>
            &#8377; {cartItem.product.price}/{cartItem.product.unit}
            <br />
            <a
              style={{ textDecoration: "none" }}
              onClick={() => {
                setEditModalOpen(true);
              }}
            >
              <i className="fa fa-edit text-dark" /> Edit &nbsp;
            </a>
            <a
              style={{ textDecoration: "none" }}
              onClick={() => {
                setDeleteModalOpen(true);
              }}
            >
              <i className="fa fa-trash text-danger" /> Remove
            </a>
          </Col>
          <Col className="p-0" lg="3">
            <h4>{cartItem.quantity}</h4>
          </Col>
        </Row>
      </CardBody>
    </>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
