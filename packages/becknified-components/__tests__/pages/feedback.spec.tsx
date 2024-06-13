import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { FeedbackProps } from '../../src/pages/feedback/feedback.types'
import Feedback from '../../src/pages/feedback/feedback'
import { ChakraProvider } from '@chakra-ui/react'

const theme = {
  colors: { primary: { '100': '#3182ce' } }
}

const renderFeedbackPageComponent = (props: FeedbackProps) => {
  render(
    <ChakraProvider theme={theme}>
      <Feedback {...props} />
    </ChakraProvider>
  )
}

describe('Feedback component', () => {
  const mockProps = {
    schema: {
      starRating: { rating: 3, setRating: jest.fn(), starCount: 5 },
      feedbackDescription: { description: <p>Feedback Description</p>, imageSrc: 'image.jpg' },
      commentBox: {
        heading: 'Your Comments',
        feedback: 'Initial feedback',
        setFeedback: jest.fn(),
        placeholder: 'Enter feedback'
      },
      buttons: [{ text: 'Submit', handleClick: jest.fn() }]
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders feedback component with provided props', () => {
    renderFeedbackPageComponent({ ...mockProps })
    // Check if feedback description and image are rendered
    expect(screen.getByText('Feedback Description')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'image.jpg')
    // Check if comment box is rendered
    expect(screen.getByPlaceholderText('Enter feedback')).toBeInTheDocument()
    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('allows user to change feedback text', () => {
    renderFeedbackPageComponent({ ...mockProps })
    const feedbackTextarea = screen.getByPlaceholderText('Enter feedback')
    fireEvent.change(feedbackTextarea, { target: { value: 'Updated feedback' } })
    expect(mockProps.schema.commentBox.setFeedback).toHaveBeenCalledWith('Updated feedback')
  })

  it('calls handleClick when submit button is clicked', () => {
    renderFeedbackPageComponent({ ...mockProps })

    const submitButton = screen.getByRole('button', { name: 'Submit' })
    fireEvent.click(submitButton)
    expect(mockProps.schema.buttons[0].handleClick).toHaveBeenCalled()
  })

  it('renders with default placeholder when no placeholder is provided', () => {
    const propsWithoutPlaceholder = {
      ...mockProps,
      schema: {
        ...mockProps.schema,
        commentBox: { ...mockProps.schema.commentBox, placeholder: undefined }
      }
    }
    renderFeedbackPageComponent({ ...propsWithoutPlaceholder })
    expect(screen.getByPlaceholderText('')).toBeInTheDocument()
  })

  it('renders correctly with no description and image', () => {
    const propsWithoutDescriptionAndImage: FeedbackProps = {
      ...mockProps,
      schema: {
        ...mockProps.schema,
        feedbackDescription: { description: null, imageSrc: '' }
      }
    }
    renderFeedbackPageComponent({ ...propsWithoutDescriptionAndImage })
    expect(screen.queryByText('Feedback Description')).toBeNull()
    expect(screen.queryByRole('img')).toHaveAttribute('src', '')
  })

  it('handles missing buttons gracefully', () => {
    const propsWithoutButtons = {
      ...mockProps,
      schema: {
        ...mockProps.schema,
        buttons: []
      }
    }
    renderFeedbackPageComponent({ ...propsWithoutButtons })
    expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull()
  })
})
