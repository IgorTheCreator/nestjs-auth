import { CredentialsDto } from '../dto'
import { Token } from '../modules/tokens/models'

export type Tokens = {
  accessToken: string
  refreshToken: Token
}

export type LogoutTokens = {
  accessToken: string
  refreshToken: string
}

export interface IAuthService {
  signup: (userAgent: string, dto: CredentialsDto) => Promise<Tokens>
  signin: (userAgent: string, dto: CredentialsDto) => Promise<Tokens>
  logout: (tokens: LogoutTokens) => Promise<{ success: boolean }>
  refresh: (userAgent: string, refreshToken: string) => Promise<Tokens>
}
