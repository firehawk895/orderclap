import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

function DeleteCartModal({ cartId, open, setModalOpen }) {
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
          <Button
            color="danger"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Yes, Delete it
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DeleteCartModal;
