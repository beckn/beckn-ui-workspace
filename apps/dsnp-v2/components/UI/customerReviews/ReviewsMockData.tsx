export interface CustomerReviewsProps {
  custName: string
  rating: number
  reviewText: string
  helpFul: number
  reviewHeading: string
}
const custReviews: CustomerReviewsProps[] = [
  {
    custName: 'Rahul',
    rating: 4,
    reviewText: ' Good products at reasonable price',
    helpFul: 8,
    reviewHeading: 'Average Product'
  },
  {
    custName: 'Ronak',
    rating: 5,
    reviewText: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit, quisquam.',
    helpFul: 19,
    reviewHeading: 'Excellent product'
  },
  {
    custName: 'Ayush',
    rating: 5,
    reviewText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, iure.',
    helpFul: 17,
    reviewHeading: 'Very Nice'
  },
  {
    custName: 'Vikram',
    rating: 2,
    reviewText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia, quasi.',
    helpFul: 14,
    reviewHeading: 'Not worth the price'
  },
  {
    custName: 'Virat',
    rating: 1,
    reviewText: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam, voluptates?',
    helpFul: 25,
    reviewHeading: 'Very bad purchase'
  }
]
export default custReviews
