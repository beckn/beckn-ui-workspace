import { ButtonProps } from '@beckn-ui/molecules'
import React from 'react'
import { StarRatingProps } from '../../components/types'

/**
 * Properties for the `Feedback` component.
 *
 * @property {StarRatingProps} schema.starRating - Properties for configuring the star rating component.
 * @property {Object} schema.feedbackDescription - Contains properties related to the feedback description.
 * @property {React.ReactNode} schema.feedbackDescription.description - The text or JSX content for the feedback description.
 * @property {string} schema.feedbackDescription.imageSrc - The source URL of the image to be displayed alongside the feedback description.
 * @property {Object} schema.commentBox - Contains properties related to the comment box.
 * @property {string} schema.commentBox.heading - The heading text for the comment box.
 * @property {string} schema.commentBox.feedback - The initial value for the feedback input.
 * @property {(value: React.SetStateAction<string>) => void} schema.commentBox.setFeedback - Function to update the feedback value.
 * @property {string} [schema.commentBox.placeholder] - Optional placeholder text for the feedback input.
 * @property {ButtonProps[]} schema.buttons - An array of button properties to render buttons. Each item adheres to the `ButtonProps` interface from `@beckn-ui/molecules`.
 */

export interface FeedbackProps {
  schema: {
    starRating: StarRatingProps
    feedbackDescription: {
      description: React.ReactNode
      imageSrc: string
    }
    commentBox: {
      heading: string
      feedback: string
      setFeedback: (value: React.SetStateAction<string>) => void
      placeholder?: string
    }
    buttons: ButtonProps[]
  }
}
