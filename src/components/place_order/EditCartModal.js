import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  Input
} from "reactstrap";
import { toast } from "react-toastify";
import * as constants from "./constants";

function EditCartModal({
  open,
  setModalOpen,
  updateCartItem,
  cartItem: {
    quantity,
    id,
    supplier: { name: supplierName },
    product: { name: productName, sku, price, unit }
  }
}) {
  const [qty, setQty] = useState(quantity);
  const [button, setButton] = useState(constants.CART_ADDED);

  useEffect(() => {
    if (qty == quantity) {
      setButton(constants.CART_ADDED);
    } else {
      setButton(constants.CART_UPDATE);
    }
  }, [qty, quantity]);

  const closeBtn = (
    <button
      className="close"
      onClick={() => {
        setModalOpen(false);
      }}
    >
      &times;
    </button>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    // don't allow an existing cart item quantity to be reduced to 0
    if (value == 0) {
      return;
    }
    setQty(value);
  }

  function handleUpdatingCart(event) {
    console.log(updateCartItem);
    if (button === constants.CART_UPDATE) {
      updateCartItem(id, qty)
        .then(() => {
          toast.success("Cart Item Updated.");
          setModalOpen(false);
        })
        .catch(the_error => {
          toast.error(the_error);
        });
    }
  }

  return (
    <>
      <Modal isOpen={open}>
        <ModalHeader close={closeBtn}>Edit Cart Item</ModalHeader>
        <ModalBody className="text-center">
          {supplierName}
          <br />
          {productName}
          <br />
          {sku}
          <br />
          {price}/{unit}
          <br />
        </ModalBody>
        <ModalFooter>
          <InputGroup>
            <Input
              value={qty}
              placeholder="Qty"
              min={0}
              max={100}
              type="number"
              step="1"
              onChange={handleChange}
            />
          </InputGroup>
          <Button color={button.colour} onClick={handleUpdatingCart} block>
            {button.text}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default EditCartModal;
