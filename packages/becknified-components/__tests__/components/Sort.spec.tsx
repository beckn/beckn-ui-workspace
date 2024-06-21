import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { SortComponentProps } from '../../src/components/sort/Sort.types'
import Sort from '../../src/components/sort'
import { ChakraProvider } from '@chakra-ui/react'

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>)
}
describe('Sort Component', () => {
  const baseProps: SortComponentProps = {
    selectedBtn: 'all',
    onChangeSelectedBtn: jest.fn()
  }

  it('renders correctly with default props', () => {
    renderWithChakra(<Sort {...baseProps} />)

    const sortIcon = screen.getByTestId('test-filter-icon')
    expect(sortIcon).toBeInTheDocument()

    const allRadioBtn = screen.getByLabelText('all') as HTMLInputElement
    expect(allRadioBtn).toBeInTheDocument()
    expect(allRadioBtn.checked).toBe(true)
  })

  it('calls onChangeSelectedBtn when radio button is clicked', () => {
    renderWithChakra(<Sort {...baseProps} />)

    const cheapestRadioBtn = screen.getByLabelText('cheapest')
    fireEvent.click(cheapestRadioBtn)

    expect(baseProps.onChangeSelectedBtn).toHaveBeenCalledTimes(1)
    expect(baseProps.onChangeSelectedBtn).toHaveBeenCalledWith(expect.any(Object))
  })
})
