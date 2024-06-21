import React from 'react'
import { render, screen } from '@testing-library/react'
import { OrderHistoryDetailsProps, OrderHistoryProps } from '../../src/components/order-history/order-history.types'
import OrderHistory from '../../src/components/order-history'

jest.mock('@beckn-ui/molecules', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>
}))

jest.mock('../../src/components/order-history/order-history-details', () => ({
  __esModule: true,
  default: ({ orderId }: { orderId: string }) => <div data-testid="order-history-details">{`Order ${orderId}`}</div>
}))

const renderOrderHistoryComponent = (props: OrderHistoryProps) => {
  return render(<OrderHistory {...props} />)
}

describe('OrderHistory', () => {
  const defaultProps: OrderHistoryProps = {
    schema: {
      orderHistoryDetails: [],
      loader: { size: 'md', color: 'blue' }
    },
    isLoading: false,
    isEmptyText: 'No orders placed'
  }

  it('should display the Loader when isLoading is true', () => {
    renderOrderHistoryComponent({ ...defaultProps, isLoading: true })

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should display the empty text when there are no order history details', () => {
    renderOrderHistoryComponent({ ...defaultProps })

    expect(screen.getByText('No orders placed')).toBeInTheDocument()
  })

  it('should render OrderHistoryDetails components when orderHistoryDetails is not empty', () => {
    const orderHistoryDetails: OrderHistoryDetailsProps[] = [
      {
        orderId: '1',
        orderState: 'PLACED',
        createdAt: '2022-07-31 01:33:29',
        quantity: 1,
        totalAmountWithSymbol: '$123'
      },
      {
        orderId: '2',
        orderState: 'CANCELLED',
        createdAt: '2022-07-29 01:33:29',
        quantity: 1,
        totalAmountWithSymbol: '$13'
      }
    ]

    renderOrderHistoryComponent({
      ...defaultProps,
      schema: { orderHistoryDetails, loader: defaultProps.schema.loader }
    })

    expect(screen.getByText('Order 1')).toBeInTheDocument()
    expect(screen.getByText('Order 2')).toBeInTheDocument()
  })
})
