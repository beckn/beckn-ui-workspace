import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import pendingIcon from '../../../public/images/pending.svg'
import completedIcon from '../../../public/images/completed.svg'
import { OrderHistoryDetailsProps } from '../../src/components/order-history/order-history.types'
import OrderHistoryDetails from '../../src/components/order-history/order-history-details'

jest.mock('../../src/components/detail-card', () => ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
))

jest.mock('../../../public/images/pending.svg', () => 'pendingIcon')
jest.mock('../../../public/images/completed.svg', () => 'completedIcon')

const renderOrderHistoryDetailsComponent = (props: OrderHistoryDetailsProps) => {
  return render(<OrderHistoryDetails {...props} />)
}

describe('OrderHistoryDetails', () => {
  const defaultProps: OrderHistoryDetailsProps = {
    orderId: '12345',
    createdAt: '2023-06-10T00:00:00Z',
    totalAmountWithSymbol: '$100',
    quantity: 3,
    orderState: 'pending',
    onClick: jest.fn()
  }

  it('should render order details correctly', () => {
    renderOrderHistoryDetailsComponent({ ...defaultProps })

    expect(screen.getByText(`Placed at ${defaultProps.createdAt}`)).toBeInTheDocument()
    expect(screen.getByText(`Order Details Id ${defaultProps.orderId}`)).toBeInTheDocument()
    expect(screen.getByText('Order in progress')).toBeInTheDocument()
    expect(screen.getByText(defaultProps.totalAmountWithSymbol)).toBeInTheDocument()
    expect(screen.getByText(`${defaultProps.quantity} items`)).toBeInTheDocument()
    expect(screen.getByText(defaultProps.orderState)).toBeInTheDocument()
  })

  it('should display the PENDING icon based on order state', () => {
    renderOrderHistoryDetailsComponent({ ...defaultProps })
    const pendingImage = screen.getByRole('img')
    expect(pendingImage).toHaveAttribute('src', pendingIcon)
  })

  it('should display the COMPLETED icon based on order state', () => {
    renderOrderHistoryDetailsComponent({ ...defaultProps, orderState: 'completed' })
    const completedImage = screen.getByRole('img')
    expect(completedImage).toHaveAttribute('src', completedIcon)
  })

  it('should call onClick handler when clicked', () => {
    renderOrderHistoryDetailsComponent({ ...defaultProps })
    const container = screen
      .getByText(`Order Details Id ${defaultProps.orderId}`)
      .closest('div')
      ?.closest('div')
      ?.closest('div')
    fireEvent.click(container!)
    expect(defaultProps.onClick).toHaveBeenCalled()
  })
})
