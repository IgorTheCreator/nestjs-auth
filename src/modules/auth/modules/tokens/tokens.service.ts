import * as dateFns from 'date-fns'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ITokensRepository, ITokensService, TokensRepository } from './interfaces'
import { IPayload } from 'src/shared/interfaces'
import { Token } from './models'
import { ConfigService } from 'src/core/config/config.service'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class TokensService implements ITokensService {
  private readonly logger = new Logger(TokensService.name)
  constructor(
    @Inject(TokensRepository) private readonly tokensRepository: ITokensRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  private async deleteExpiredRefreshTokens() {
    const count = await this.tokensRepository.deleteExpiredRefreshTokens()
    this.logger.log(`Number of deleted refresh tokens: ${count}`)
  }

  async findRefreshTokenByToken(token: string) {
    const tokenFromDb = await this.tokensRepository.findRefreshTokenByToken(token)
    if (!tokenFromDb || tokenFromDb.expiresAt < new Date()) {
      return null
    }
    return tokenFromDb
  }

  async findRefreshTokenByUserIdAndUserAgent(userId: string, userAgent: string) {
    const tokenFromDb = await this.tokensRepository.findRefreshTokenByUserIdAndUserAgent(
      userId,
      userAgent,
    )
    if (!tokenFromDb || tokenFromDb.expiresAt < new Date()) {
      return null
    }
    return tokenFromDb
  }

  async deleteRefreshTokenByToken(token: string) {
    await this.tokensRepository.deleteRefreshTokenByToken(token)
  }

  getAccessToken(payload: IPayload) {
    return this.jwtService.signAsync(payload)
  }

  async getRefreshToken(userId: string, userAgent: string) {
    const token = await this.tokensRepository.findRefreshTokenByUserIdAndUserAgent(
      userId,
      userAgent,
    )
    if (!token) {
      const newToken = new Token({
        userAgent,
        userId,
        expiresAt: dateFns.add(new Date(), { days: this.config.REFRESH_TOKEN_VALID }),
      })
      const refreshToken = await this.tokensRepository.createRefreshToken(newToken)
      return refreshToken
    }
    const newToken = new Token({
      userAgent,
      userId,
      expiresAt: dateFns.add(new Date(), { days: this.config.REFRESH_TOKEN_VALID }),
    })
    const refreshToken = await this.tokensRepository.updateRefreshToken(newToken)
    return refreshToken
  }
}
