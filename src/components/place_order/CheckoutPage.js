import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  deleteCartItem,
  updateCartItem,
  loadCarts
} from "../../redux/actions/cartActions";
import { getSupplierMap } from "./selectors";
import SpinnerWrapper from "../common/SpinnerWrapper";
import {
  Alert,
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Collapse,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

function CheckoutPage({
  supplier_map,
  deleteCartItem,
  updateCartItem,
  loading,
  loadCarts,
  total_order_value
}) {
  const [errors, setErrors] = useState("");
  useEffect(() => {
    loadCarts().catch(the_error => setErrors(the_error.message));
  }, []);
  const supplier_row_list = [];
  for (let supplier_id in supplier_map) {
    supplier_row_list.push(
      <SupplierRow
        key={supplier_id}
        supplier={supplier_map[supplier_id].supplier}
        cartItems={supplier_map[supplier_id].cart_items}
        total={supplier_map[supplier_id].total}
        deleteCartItem={deleteCartItem}
        updateCartItem={updateCartItem}
      />
    );
  }
  return (
    <>
      <h2>Checkout:</h2>
      {loading ? (
        <SpinnerWrapper />
      ) : errors ? (
        <Alert color="danger">{errors}</Alert>
      ) : (
        <Container>
          <Row>
            <Col lg="9">{supplier_row_list}</Col>
            <Col lg="3">
              <CheckoutSummary total={total_order_value} />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

function mapStateToProps(state) {
  const supplier_map = getSupplierMap(state.carts);
  // haan bsdk reducer likho
  let total_order_value = 0;
  for (let key in supplier_map) {
    total_order_value += supplier_map[key].total;
  }
  return {
    supplier_map,
    loading: state.apiCallsInProgress > 0,
    total_order_value
  };
}

const mapDispatchToProps = {
  deleteCartItem,
  updateCartItem,
  loadCarts
};

function SupplierRow({
  supplier,
  cartItems,
  total,
  deleteCartItem,
  updateCartItem
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function toggleCollapse() {
    setIsCollapsed(prevState => !prevState);
  }
  return (
    <>
      <Card>
        <CardHeader>
          {supplier.name}
          <div className="float-right">Total: &#8377; {total}</div>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg="2">
              <Button color="primary" onClick={toggleCollapse} className="mb-2">
                Show {cartItems.length} Item(s)
              </Button>
            </Col>
            <Col lg="8" className="d-flex justify-content-center">
              <Form inline>
                Delivery Date:&nbsp;
                <Input
                  type="date"
                  name="date"
                  id="exampleDate"
                  placeholder="delivery date"
                />
              </Form>
            </Col>
            <Col lg="2">
              <Button className="float-right" color="success">
                Place Order
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Collapse isOpen={isCollapsed}>
                <Card>
                  <CardBody>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident.
                  </CardBody>
                </Card>
              </Collapse>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Button color="primary">Add Products</Button>
            </Col>
            <Col>
              <Button color="danger">Remove Order</Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

function CheckoutSummary({ total }) {
  return (
    <Row>
      <Col>
        <Card>
          <CardHeader>Checkout Summary</CardHeader>
          <CardBody>
            All Orders:
            <div className="float-right">&#8377; {total}</div>
            <br />
            Delivery: <div className="float-right">&#8377; 0</div>
            <br />
            <b>
              Total: <div className="float-right">&#8377; {total}</div>
            </b>
            <Button className="mt-4" color="success" block>
              Send Orders
            </Button>
            <Button color="danger" block>
              Remove All Orders
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutPage);
