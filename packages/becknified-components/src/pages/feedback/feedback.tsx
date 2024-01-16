import React from 'react'
import { Box, Text, Image, Textarea } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import Button from '@beckn-ui/molecules/src/components/button/Button'
import { StarRating } from '../../components'
import { FeedbackProps } from './feedback.types'

/**
 * Feedback Component
 *
 * Renders a feedback form including a star rating, a descriptive section with an image,
 * a comment box, and an array of buttons. The component is configured through the `FeedbackProps` interface.
 *
 * @component
 * @param {FeedbackProps} props - The properties for configuring the feedback component.
 *
 * The `props.schema` object contains:
 * - `starRating`: Configuration for the star rating component. It includes:
 *   - `rating` (number): The current rating.
 *   - `setRating` (function): Function to update the rating.
 *   - `starCount` (number): Total number of stars.
 *   - `size?` (number): Optional size of the stars.
 *   - `ratingText?` (string): Optional text displayed with the rating.
 * - `feedbackDescription`: Contains the feedback description and an image. It includes:
 *   - `description` (React.ReactNode): The content for the feedback description.
 *   - `imageSrc` (string): The source URL of the image.
 * - `commentBox`: Configuration for the comment box. It includes:
 *   - `heading` (string): The heading text for the comment box.
 *   - `feedback` (string): The initial value for the feedback input.
 *   - `setFeedback` (function): Function to update the feedback value.
 *   - `placeholder?` (string): Optional placeholder text for the feedback input.
 * - `buttons`: An array of `ButtonProps` for rendering buttons. Each `ButtonProps` includes:
 *   - `text?` (string): Optional text for the button.
 *   - `className?` (string): Optional CSS class for styling.
 *   - `handleClick?` (function): Optional click event handler.
 *   - `children?` (React.ReactNode): Optional child elements for the button.
 *   - `disabled?` (boolean): Optional disabled state for the button.
 *   - `fullWidth?` (boolean): Optional flag for full-width button.
 *   - `variant?` ('outline' | 'solid'): Optional button style variant.
 *   - `colorScheme?` ('primary' | 'secondary'): Optional color scheme.
 *   - `type?` (ButtonType): Optional HTML button type.
 *
 * @example
 * <Feedback
 *   schema={{
 *     starRating: { rating: 3, setRating: handleRatingChange, starCount: 5 },
 *     feedbackDescription: { description: <p>Feedback</p>, imageSrc: 'image.jpg' },
 *     commentBox: { heading: 'Your Comments', feedback: 'Initial feedback', setFeedback: handleFeedbackChange, placeholder: 'Enter feedback' },
 *     buttons: [{ text: 'Submit', handleClick: handleSubmit, variant: 'solid', colorScheme: 'primary' }]
 *   }}
 * />
 */

const Feedback: React.FC<FeedbackProps> = props => {
  const {
    schema: { buttons, commentBox, feedbackDescription, starRating }
  } = props
  const { feedback, heading, setFeedback, placeholder = '' } = commentBox
  const { description, imageSrc } = feedbackDescription

  return (
    <>
      <Box
        textAlign={'center'}
        pb={'15px'}
      >
        {description}
      </Box>
      <Box mb={'10px'}>
        <Image
          src={imageSrc}
          margin={'0 auto'}
        />
      </Box>
      <Box>
        <StarRating {...starRating} />
        <Text
          as={Typography}
          text={heading}
          fontSize={'15px'}
          fontWeight={400}
          mb={'10px'}
        />
        <Textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          height={'124px'}
          resize={'none'}
          mb={'20px'}
          placeholder={placeholder}
          boxShadow={'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'}
        />

        {buttons.map((button, idx) => {
          return (
            <Button
              key={idx}
              {...button}
            />
          )
        })}
      </Box>
    </>
  )
}

export default Feedback
