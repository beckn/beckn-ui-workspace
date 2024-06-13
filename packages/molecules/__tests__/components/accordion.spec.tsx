// accordion.spec.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Accordion from '../../src/components/accordion/Accordion'
import { AccordionProps } from '../../src/components/accordion/accordion.types'

const theme = extendTheme({
  colors: {
    primary: {
      100: '#ff0000'
    },
    textPrimary: '#000000'
  }
})

// Mock window.scrollTo
beforeAll(() => {
  Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true })
})

const renderAccordionComponent = (props: AccordionProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <Accordion {...props} />
    </ChakraProvider>
  )
}

describe('Accordion component', () => {
  test('renders the accordion header correctly', () => {
    renderAccordionComponent({ accordionHeader: 'Accordion Header', children: <div>Accordion Content</div> })
    expect(screen.getByText('Accordion Header')).toBeInTheDocument()
  })

  test('renders the accordion content correctly', () => {
    renderAccordionComponent({ accordionHeader: 'Accordion Header', children: <div>Accordion Content</div> })
    expect(screen.getByText('Accordion Content')).toBeInTheDocument()
  })

  test('calls onToggle function when the accordion header is clicked', async () => {
    const handleToggle = jest.fn()
    renderAccordionComponent({
      accordionHeader: 'Accordion Header',
      children: <div>Accordion Content</div>,
      onToggle: handleToggle
    })
    const header = screen.getByText('Accordion Header')

    fireEvent.click(header)

    expect(handleToggle).toHaveBeenCalled()
  })

  test('calls onToggle function when the accordion header is clicked', () => {
    const handleToggle = jest.fn()
    renderAccordionComponent({
      accordionHeader: 'Accordion Header',
      children: <div>Accordion Content</div>,
      onToggle: handleToggle
    })
    const header = screen.getByText('Accordion Header')

    fireEvent.click(header)
    expect(handleToggle).toHaveBeenCalled()
  })

  test('applies the custom class name correctly', () => {
    renderAccordionComponent({
      accordionHeader: 'Accordion Header',
      children: <div>Accordion Content</div>,
      className: 'custom-class'
    })
    const header = screen.getByText('Accordion Header')

    expect(header).toHaveClass('custom-class-accordion-header-text')
  })
})
