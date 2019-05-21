import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";

function DeleteModal({
  open,
  setModalOpen,
  deleterThunk,
  successToastMessage
}) {
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

  function handleDelete() {
    setModalOpen(false);
    toast.success(successToastMessage);
    deleterThunk();
  }

  return (
    <>
      <Modal isOpen={open}>
        <ModalHeader close={closeBtn} />
        <ModalBody className="text-center">Are you sure?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            No!
          </Button>{" "}
          <Button color="danger" onClick={handleDelete}>
            Yes!
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DeleteModal;
