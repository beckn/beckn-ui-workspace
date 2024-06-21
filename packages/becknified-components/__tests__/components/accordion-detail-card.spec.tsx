import React from 'react'
import { render, screen } from '@testing-library/react'
import AccordionDetailCard from '../../src/components/accordion-detail-card'
import { AccordionDetailCardProps } from '../../src/components/accordion-detail-card/accordion-detail-card.types'

jest.mock('@beckn-ui/molecules', () => ({
  Accordion: jest.fn(({ children }) => <div data-testid="accordion">{children}</div>),
  Typography: jest.fn(({ text, className }) => <p className={className}>{text}</p>)
}))

jest.mock('@chakra-ui/react', () => ({
  CardBody: jest.fn(({ children }) => <div data-testid="card-body">{children}</div>),
  Flex: jest.fn(({ children }) => <div>{children}</div>)
}))

const renderAccordionComponent = (props: AccordionDetailCardProps) => {
  return render(<AccordionDetailCard {...props}></AccordionDetailCard>)
}

describe('AccordionDetailCard Component', () => {
  const defaultProps: AccordionDetailCardProps = {
    schema: {
      accordion: { accordionHeader: 'Test Accordion' },
      dataSource: {
        source: {
          key1: 'value1',
          key2: 'value2'
        },
        className: 'test-class'
      }
    }
  }

  it('should render the Accordion component', () => {
    renderAccordionComponent({ ...defaultProps })
    expect(screen.getByTestId('accordion')).toBeInTheDocument()
  })

  it('should render CardBody component inside Accordion', () => {
    renderAccordionComponent({ ...defaultProps })
    expect(screen.getByTestId('card-body')).toBeInTheDocument()
  })

  it('should render children if provided', () => {
    const children = <div data-testid="child">Child Content</div>
    renderAccordionComponent({ ...defaultProps, children })
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('should render data source if children are not provided', () => {
    renderAccordionComponent({ ...defaultProps })
    expect(screen.getByText('key1')).toBeInTheDocument()
    expect(screen.getByText('value1')).toBeInTheDocument()
    expect(screen.getByText('key2')).toBeInTheDocument()
    expect(screen.getByText('value2')).toBeInTheDocument()
  })

  it('should apply className from dataSource to Typography components', () => {
    renderAccordionComponent({ ...defaultProps })
    expect(screen.getByText('key1')).toHaveClass('test-class_key')
    expect(screen.getByText('value1')).toHaveClass('test-class_value')
  })

  it('should render empty content if neither children nor dataSource are provided', () => {
    const propsWithoutChildrenOrDataSource: AccordionDetailCardProps = {
      schema: {
        accordion: { accordionHeader: 'Test Accordion' },
        dataSource: { source: {} }
      }
    }
    renderAccordionComponent({ ...propsWithoutChildrenOrDataSource })
    expect(screen.getByTestId('card-body')).toBeEmptyDOMElement()
  })
})
