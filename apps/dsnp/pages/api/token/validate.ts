// pages/api/token.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import Token from '@modals/Token'
import dbConnect from '@lib/dbConnect'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()
  if (req.method === 'POST') {
    try {
      // Create a new token document
      const fetchedToken = await Token.findOne({ token: req.body.token })
      if (fetchedToken) {
        await Token.deleteOne({ token: req.body.token })
        res.status(200).json({ validate: true })
      } else {
        res.status(201).json({ validate: false })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error validating token' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
