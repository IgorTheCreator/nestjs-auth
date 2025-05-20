import { randomUUID } from 'node:crypto'

type TokenConstructor = {
  userAgent: string
  userId: string
  expiresAt: Date
}

export class Token {
  token: string
  userAgent: string
  userId: string
  expiresAt: Date

  constructor({ userAgent, userId, expiresAt }: TokenConstructor) {
    this.token = randomUUID()
    this.userAgent = userAgent
    this.userId = userId
    this.expiresAt = expiresAt
  }
}
