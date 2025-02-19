import jwt from 'jsonwebtoken'
import { IUser } from '../lib/types/user'
import buyerIcon from '@public/images/buyer-icon.svg'
import sellerIcon from '@public/images/seller-icon.svg'

export const signToken = (user: IUser) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: '30d'
  })
}

export const accountType = [
  {
    id: 'buyer',
    src: buyerIcon,
    alt: 'buyer'
  },
  {
    id: 'seller',
    src: sellerIcon,
    alt: 'seller'
  }
]
