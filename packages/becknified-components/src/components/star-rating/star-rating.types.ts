/**
 * Props for the StarRating component.
 *
 * @property {number} rating - The current rating value. Defaults to 0.
 * @property {string} ratingText - Optional text to display alongside the rating.
 * @property {(rating: number) => void} setRating - Callback function that is called with the new rating value when a star is clicked. If not provided, the component is read-only.
 * @property {number} size - Optional size of the stars in pixels. Defaults to 20.
 * @property {number} starCount - Total number of stars to display. Defaults to 5.
 */

export interface StarRatingProps {
  rating: number
  setRating: (rating: number) => void
  starCount: number
  size?: number
  ratingText?: string
}
