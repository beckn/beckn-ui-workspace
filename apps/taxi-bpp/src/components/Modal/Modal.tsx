'use client'

import { Modal } from 'react-bootstrap'

export default function CustomModal({ children, ...rest }: any) {
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
  )
}
