import React from "react";
import { Container, Row, Col, Spinner } from "reactstrap";

function SpinnerWrapper(props) {
  return (
    <Container fluid>
      <Row>
        <Col lg="5" />
        <Col lg="2">
          <Spinner color="success" style={{ width: "5rem", height: "5rem" }} />
        </Col>
        <Col lg="5" />
      </Row>
    </Container>
  );
}
export default SpinnerWrapper;
