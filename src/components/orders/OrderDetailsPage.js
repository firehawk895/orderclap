import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Table,
  FormGroup,
  Label,
  Input,
  InputGroup
} from "reactstrap";
import { PAYMENT_STATUSES } from "./constants";

function OrderDetailsPage(props) {
  return (
    <>
      <h2>Order Details Page</h2>
      <Row>
        <Col lg="8">
          <InvoiceCard />
        </Col>
        <Col lg="4">
          <OrderSummary />
        </Col>
      </Row>
    </>
  );
}

function InvoiceCard(props) {
  return (
    <Card>
      <CardBody>
        <h2 className="text-primary text-center">Kaithal Store</h2>
        <Row>
          <Col>
            <b>Order #36651758</b>
            <br />
            ORGANO FRESH Invoice Number: <b>7562</b>
            <br />
            Requested Delivery Date: <b>May 26, 2019</b>
            <br />
            <br />
            Placed by: <b>crustos@mailinator.com</b>
            <br />
            Checked in by: <b>crustos@mailinator.com</b>
            <br />
            Checked in at: <b>May 26, 2019 9:50:11 PM</b>
          </Col>
          <Col className="text-right">
            Received: <br />
            <b>May 31, 2019 12:13 PM</b>
          </Col>
        </Row>
        <br />
        <br />
        <InvoiceTable />
        <Row>
          <Col lg="8" />
          <Col>
            <Table striped>
              <tbody>
                <tr>
                  <td>Sub Total:</td>
                  <td>&#8377; 538</td>
                </tr>
                <tr>
                  <td>Delivery Charge:</td>
                  <td>&#8377; TBD</td>
                </tr>
                <tr>
                  <td>PO Total:</td>
                  <td>&#8377; 564.80</td>
                </tr>
                <tr>
                  <td>Check-in Total:</td>
                  <td>&#8377; 264.80</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

function InvoiceTable(props) {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Status</th>
          <th>Product</th>
          <th>Price/Unit</th>
          <th>Total Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Ordered: 0.10
            <br />
            Received: 0.05
          </td>
          <td>Received (Partial)</td>
          <td>
            Amul Cheese <br />
            SKU: 0001
          </td>
          <td>&#8377; 2000/1 kg</td>
          <td>&#8377; 4200</td>
        </tr>
        <tr>
          <td>
            Ordered: 0.10
            <br />
            Received: 0.05
          </td>
          <td>Received (Partial)</td>
          <td>
            Amul Cheese <br />
            SKU: 0001
          </td>
          <td>&#8377; 2000/1 kg</td>
          <td>&#8377; 4200</td>
        </tr>
      </tbody>
    </Table>
  );
}

function OrderSummary(props) {
  return (
    <Card>
      <CardHeader>Order Summary</CardHeader>
      <CardBody className="d-flex flex-column">
        <div className="p-2">
          Order Date: <b>May 31, 2019 12:13:48 PM</b>
        </div>
        <div className="p-2">Order Total: &#8377; 264.80</div>
        <div className="p-2">
          <Button color="primary" block>
            Check-In
          </Button>
        </div>
        <hr />
        <div className="p-2">
          <FormGroup>
            <Label for="exampleSelect">Payment Status</Label>
            <Input type="select" name="select" id="exampleSelect">
              <option>{PAYMENT_STATUSES.INVOICE_RECEIVED}</option>
              <option>{PAYMENT_STATUSES.PAID_FULL}</option>
              <option>{PAYMENT_STATUSES.PAID_PARTIAL}</option>
              <option>{PAYMENT_STATUSES.DISPUTED}</option>
              <option>{PAYMENT_STATUSES.DUE}</option>
            </Input>
          </FormGroup>
        </div>
        <div className="p-2">
          <FormGroup>
            <Label for="exampleSelect">Invoice Number</Label>
            <InputGroup>
              <Input placeholder="Custom Invoice. No." />
              <Button color="success">Save</Button>
            </InputGroup>
          </FormGroup>
        </div>
      </CardBody>
    </Card>
  );
}

export default OrderDetailsPage;
