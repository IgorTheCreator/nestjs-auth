import { Injectable, Logger } from '@nestjs/common'
import { ITokensRepository } from './interfaces'
import { Token } from './models'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class TokensStorage implements ITokensRepository {
  private readonly logger = new Logger(TokensStorage.name)
  constructor(private readonly db: PrismaService) {}

  async deleteExpiredRefreshTokens() {
    const { count } = await this.db.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    })
    return count
  }

  async findRefreshTokenByToken(token: string) {
    const refreshToken = await this.db.refreshToken.findUnique({
      where: {
        token,
      },
    })
    return refreshToken
  }

  async findRefreshTokenByUserIdAndUserAgent(userId: string, userAgent: string) {
    const refreshToken = await this.db.refreshToken.findFirst({
      where: {
        userId,
        userAgent,
      },
    })
    return refreshToken
  }

  async createRefreshToken(refreshToken: Token) {
    const newRefreshToken = await this.db.refreshToken.create({
      data: refreshToken,
    })
    return newRefreshToken
  }

  async updateRefreshToken(token: Partial<Token>) {
    const updatedRefreshToken = await this.db.refreshToken.update({
      where: {
        userId_userAgent: {
          userAgent: token.userAgent!,
          userId: token.userId!,
        },
      },
      data: token,
    })
    return updatedRefreshToken
  }

  async deleteRefreshTokenByToken(token: string) {
    await this.db.refreshToken
      .delete({
        where: {
          token,
        },
      })
      .catch((e) => {
        this.logger.warn(e)
      })
  }
}
