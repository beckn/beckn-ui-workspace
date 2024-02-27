import Modal from "react-bootstrap/Modal";

export function AlertModal({ children, ...rest }) {
  return (
    <Modal {...rest} size="sm" aria-labelledby="contained-modal-title-vcenter">
      {/* <Modal.Header closeButton>
        </Modal.Header> */}
      {children}
    </Modal>
  );
}
