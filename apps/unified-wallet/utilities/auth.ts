import jwt from 'jsonwebtoken'

export const signToken = (user: any) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: '30d'
  })
}
