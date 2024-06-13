// bottom-modal.spec.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import BottomModal from '../../src/components/bottom-modal/bottom-modal'
import { BottomModalProps } from '../../src/components/bottom-modal/bottom-modal.types'

const renderBottomModal = (props: BottomModalProps) => {
  return render(
    <ChakraProvider>
      <BottomModal {...props} />
    </ChakraProvider>
  )
}

describe('BottomModal component', () => {
  const defaultProps: BottomModalProps = {
    onClose: jest.fn(),
    isOpen: true,
    title: 'Modal Title',
    children: <div>Modal Content</div>,
    responsive: false
  }

  test('renders the modal with correct title and content', () => {
    renderBottomModal(defaultProps)

    expect(screen.getByText('Modal Title')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  test('calls onClose when the close button is clicked', () => {
    renderBottomModal(defaultProps)

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  test('applies responsive bottom gap correctly', () => {
    renderBottomModal({ ...defaultProps, responsive: true, responsiveBottomGap: '20' })

    const modalContent = screen.getByRole('dialog')
    expect(modalContent).toHaveStyle(`bottom: 0`)
  })

  test('modal is centered and open', () => {
    renderBottomModal(defaultProps)

    const modal = screen.getByRole('dialog')
    expect(modal).toHaveStyle('position: fixed')
    expect(modal).toBeInTheDocument()
  })
})
