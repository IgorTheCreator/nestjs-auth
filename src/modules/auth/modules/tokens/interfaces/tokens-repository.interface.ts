import { Token } from '../models'

export interface ITokensRepository {
  findRefreshTokenByToken: (token: string) => Promise<Token | null>
  findRefreshTokenByUserIdAndUserAgent: (userId: string, userAgent: string) => Promise<Token | null>
  createRefreshToken: (refreshToken: Token) => Promise<Token>
  updateRefreshToken: (refreshToken: Partial<Token>) => Promise<Token>
  deleteRefreshTokenByToken: (token: string) => Promise<void>
  deleteExpiredRefreshTokens: () => Promise<number>
}

export const TokensRepository = Symbol('ITokensRepository')
