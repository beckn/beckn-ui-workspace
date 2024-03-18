'use client'

import { Modal } from 'react-bootstrap'

export default function AlertModal({ children, ...rest }: any) {
  return (
    <Modal
      {...rest}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
    >
      {/* <Modal.Header closeButton>
        </Modal.Header> */}
      {children}
    </Modal>
  )
}
