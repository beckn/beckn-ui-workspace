import React from 'react'
import { render, screen } from '@testing-library/react'
import BecknProvider from '../../src/components/beckn-provider/beckn-provider'
import { generateTheme } from '../../src/components/beckn-provider/beckn-provider.utils'
import { BecknProivderProps } from '../../src/components/beckn-provider/beckn-provider.types'
import { ChakraProvider } from '@chakra-ui/react'

// Mock the generateTheme function
jest.mock('../../src/components/beckn-provider/beckn-provider.utils', () => ({
  generateTheme: jest.fn()
}))

describe('BecknProvider component', () => {
  const mockTheme = { color: { primary: 'blue' } }
  const mockGeneratedTheme = { colors: { primary: 'blue', secondary: 'green' } }
  const childrenContent = 'Provider Children Content'

  beforeAll(() => {
    ;(generateTheme as jest.Mock).mockReturnValue(mockGeneratedTheme)
  })

  const renderBecknProvider = (props: BecknProivderProps) => {
    return render(<BecknProvider {...props}>{childrenContent}</BecknProvider>)
  }

  test('renders children correctly', () => {
    renderBecknProvider({ theme: mockTheme, children: <></> })

    expect(screen.getByText(childrenContent)).toBeInTheDocument()
  })

  test('calls generateTheme with provided theme', () => {
    renderBecknProvider({ theme: mockTheme, children: <></> })

    expect(generateTheme).toHaveBeenCalledWith(mockTheme)
  })
})
