import Modal from "react-bootstrap/Modal";

export function CustomModal({ children, ...rest }) {
  return (
    <Modal
      {...rest}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/* <Modal.Header closeButton>
        </Modal.Header> */}
      {children}
    </Modal>
  );
}
