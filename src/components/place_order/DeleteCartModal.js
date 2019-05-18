import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";

function DeleteCartModal({ cartId, open, setModalOpen, deleteCartItem }) {
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

  function handleDeleteCartItem() {
    setModalOpen(false);
    toast.success("Cart Item deleted.");
    deleteCartItem(cartId);
  }

  return (
    <>
      <Modal isOpen={open}>
        <ModalHeader close={closeBtn} />
        <ModalBody className="text-center">Are you suar? (oink oink)</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            No!
          </Button>{" "}
          <Button color="danger" onClick={handleDeleteCartItem}>
            Yes, Delete it
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DeleteCartModal;
