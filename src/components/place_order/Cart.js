import React, { useState } from "react";
import { connect } from "react-redux";
import { CardHeader, CardBody, Row, Col, Card, Button } from "reactstrap";
import { Link } from "react-router-dom";
import DeleteCartModal from "./DeleteCartModal";
import { deleteCartItem } from "../../redux/actions/cartActions";

function Cart({ supplier_map, deleteCartItem }) {
  const cart_supplier_rows = [];
  for (let supplier_id in supplier_map) {
    console.log(supplier_id);
    cart_supplier_rows.push(
      <CartSupplierRow
        key={supplier_id}
        supplier={supplier_map[supplier_id].supplier}
        cartItems={supplier_map[supplier_id].cart_items}
        deleteCartItem={deleteCartItem}
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
  //making a map keyed with supplier
  var supplier_map = state.carts.results.reduce(function(map, obj) {
    map[obj.supplier.id] = { supplier: obj.supplier, cart_items: [] };
    return map;
  }, {});
  console.log("what a map");
  console.log(supplier_map);
  // filling each supplier with its cart_items
  state.carts.results.forEach(result => {
    supplier_map[result.supplier.id].cart_items.push(result);
  });

  // supplier map looks like:
  /*
  {
     <supplier_id> : {
         supplier: <supplier Object>,
         cart_items: <Array of Cart Items>
     },
     <supplier_id> : {
         supplier: <supplier Object>,
         cart_items: <Array of Cart Items>
     },
     ...
  }
  Each Cart Item object loooks like:
  {
      supplier: supplier Object,
      product: product Object,
      restaurant: restaurant Object,
      quantity: <number>,
      note: <String>
  }
  */
  return {
    supplier_map
  };
}

const mapDispatchToProps = {
  deleteCartItem
};

function CartSupplierRow({ supplier, cartItems, deleteCartItem }) {
  const cart_item_rows = [];
  cartItems.forEach(cartItem => {
    let {
      product: { name: product_name, price, unit },
      quantity
    } = cartItem;
    cart_item_rows.push(
      <CartItemRow
        key={cartItem.id}
        cartItem={cartItem}
        productName={product_name}
        price={price}
        unit={unit}
        quantity={quantity}
        cartId={cartItem.id}
        deleteCartItem={deleteCartItem}
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

function CartItemRow({
  cartItem,
  productName,
  price,
  unit,
  quantity,
  cartId,
  deleteCartItem
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <DeleteCartModal
        cartId={cartId}
        open={modalOpen}
        setModalOpen={setModalOpen}
        deleteCartItem={deleteCartItem}
        cartItem={cartItem}
      />
      <CardBody>
        <Row>
          <Col lg="9">
            <div className="h5">{productName}</div>
            &#8377; {price}/{unit}
            <br />
            <i className="fa fa-edit text-dark" /> Edit &nbsp;
            <a
              style={{ textDecoration: "none" }}
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <i className="fa fa-trash text-danger" /> Remove
            </a>
          </Col>
          <Col className="p-0" lg="3">
            <h4>{quantity}</h4>
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
