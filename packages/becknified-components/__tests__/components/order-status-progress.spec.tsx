import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { OrderStatusProgressProps } from '../../src/components/order-status-progress/order-status-progress.types'
import OrderStatusProgress from '../../src/components/order-status-progress'

jest.mock('@beckn-ui/molecules', () => ({
  Typography: ({ text, ...props }: { text: string }) => <div {...props}>{text}</div>
}))

const renderOrderStatusProgressComponent = (props: OrderStatusProgressProps) => {
  return render(<OrderStatusProgress {...props} />)
}

describe('OrderStatusProgress', () => {
  const defaultProps: OrderStatusProgressProps = {
    label: 'Order Placed',
    statusTime: '2023-06-10 12:00',
    className: 'test-class',
    noLine: false,
    lastElement: false
  }

  it('should render the track icon and line icon when noLine and lastElement are false', () => {
    const renderer = renderOrderStatusProgressComponent({ ...defaultProps })

    const trackIcon = renderer.getByAltText('track-icon')
    expect(trackIcon).toBeInTheDocument()

    const lineIcon = renderer.getByAltText('line-icon')
    expect(lineIcon).toBeInTheDocument()

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument()
    expect(screen.getByText(defaultProps.statusTime)).toBeInTheDocument()
  })

  it('should not render the line icon when noLine is true and lastElement is true', () => {
    renderOrderStatusProgressComponent({ ...defaultProps, noLine: true, lastElement: true })

    const trackIcon = screen.getByAltText('track-icon')
    expect(trackIcon).toBeInTheDocument()

    expect(screen.queryByAltText('line-icon')).not.toBeInTheDocument()

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument()
    expect(screen.getByText(defaultProps.statusTime)).toBeInTheDocument()
  })

  it('should render the line icon when noLine is true and lastElement is false', () => {
    renderOrderStatusProgressComponent({ ...defaultProps, noLine: true, lastElement: false })

    const trackIcon = screen.getByAltText('track-icon')
    expect(trackIcon).toBeInTheDocument()

    const lineIcon = screen.getByAltText('line-icon')
    expect(lineIcon).toBeInTheDocument()

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument()
    expect(screen.getByText(defaultProps.statusTime)).toBeInTheDocument()
  })

  it('should render the line icon when noLine is false and lastElement is true', () => {
    renderOrderStatusProgressComponent({ ...defaultProps, noLine: false, lastElement: true })

    const trackIcon = screen.getByAltText('track-icon')
    expect(trackIcon).toBeInTheDocument()

    const lineIcon = screen.getByAltText('line-icon')
    expect(lineIcon).toBeInTheDocument()

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument()
    expect(screen.getByText(defaultProps.statusTime)).toBeInTheDocument()
  })

  it('should render the label and status time correctly', () => {
    renderOrderStatusProgressComponent({ ...defaultProps })

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument()
    expect(screen.getByText(defaultProps.statusTime)).toBeInTheDocument()
  })
})
