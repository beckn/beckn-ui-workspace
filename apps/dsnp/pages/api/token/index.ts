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
      const tokenList = await Token.find()
      console.log('Dank', tokenList)
      const newToken = await Token.create({ token: uuidv4() })
      res.status(201).json(newToken)
    } catch (error) {
      res.status(500).json({ error: 'Error creating token' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
