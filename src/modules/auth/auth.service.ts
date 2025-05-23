import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { IUsersService, Users } from '../users/interfaces'
import { IAuthService, LogoutTokens } from './interfaces'
import { CredentialsDto } from './dto'
import { ITokensService, Tokens } from './modules/tokens/interfaces'
import { RedisService } from 'src/core/redis/redis.service'
import { compare } from 'src/shared/functions'

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Users) private readonly usersService: IUsersService,
    @Inject(Tokens) private readonly tokensService: ITokensService,
    private readonly redis: RedisService,
  ) {}

  async signup(userAgent: string, { email, password }: CredentialsDto) {
    const existedUser = await this.usersService.findByEmail(email)
    if (existedUser) {
      throw new ConflictException('User already exists')
    }
    const user = await this.usersService.save({ email, password })
    const accessToken = await this.tokensService.getAccessToken({ id: user.id, role: user.role })
    const refreshToken = await this.tokensService.getRefreshToken(user.id, userAgent)

    return { accessToken, refreshToken }
  }

  async signin(userAgent: string, { email, password }: CredentialsDto) {
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid login or password')
    }
    const isValid = await compare(password, user.password)
    if (!isValid) {
      throw new UnauthorizedException('Invalid login or password')
    }
    const accessToken = await this.tokensService.getAccessToken({ id: user.id, role: user.role })
    const refreshToken = await this.tokensService.getRefreshToken(user.id, userAgent)

    return { accessToken, refreshToken }
  }

  async refresh(userAgent: string, refreshToken: string) {
    const token = await this.tokensService.findRefreshTokenByToken(refreshToken)
    if (!token) {
      throw new UnauthorizedException()
    }
    await this.tokensService.deleteRefreshTokenByToken(token.token)
    const newRefreshToken = await this.tokensService.getRefreshToken(token.userId, userAgent)
    const user = await this.usersService.findById(token.userId)
    if (!user) {
      throw new BadRequestException('User not found')
    }
    const accessToken = await this.tokensService.getAccessToken({
      id: refreshToken,
      role: user.role,
    })

    return { accessToken, refreshToken: newRefreshToken }
  }

  async logout({ accessToken, refreshToken }: LogoutTokens) {
    await this.redis.set(accessToken, accessToken, 'EX', 3 * 60 * 60)
    await this.tokensService.deleteRefreshTokenByToken(refreshToken)
    return { success: true }
  }
}
