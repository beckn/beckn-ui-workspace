// models/Token.ts
import mongoose, { Document, Model, Schema } from 'mongoose'

interface IToken {
  token: string
  createdAt?: Date
}

interface ITokenModel extends IToken, Document {}

const TokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // TTL for 5 minutes, specified in seconds
  }
})

// TypeScript will enforce the unique property of the token
TokenSchema.index({ token: 1 }, { unique: true })

const Token: Model<ITokenModel> = mongoose.models.Token || mongoose.model<ITokenModel>('Token', TokenSchema)

export default Token
