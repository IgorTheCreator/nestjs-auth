import { IPayload } from 'src/shared/interfaces'
import { Token } from '../models'

export interface ITokensService {
  findRefreshTokenByToken: (token: string) => Promise<Token | null>
  findRefreshTokenByUserIdAndUserAgent: (userId: string, userAgent: string) => Promise<Token | null>
  deleteRefreshTokenByToken: (token: string) => Promise<void>
  getAccessToken: (payload: IPayload) => Promise<string>
  getRefreshToken: (userId: string, userAgent: string) => Promise<Token>
}

export const Tokens = Symbol('ITokensService')