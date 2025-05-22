import { FastifyReply } from 'fastify'
import { Body, Controller, Headers, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Cookie, Public, UserAgent } from 'src/shared/decorators'
import { CredentialsDto } from './dto'
import { Token } from './modules/tokens/models'
import { JwtAuthGuard } from './guards'
import { ApiBearerAuth } from '@nestjs/swagger'

const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token'

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Res({ passthrough: true }) reply: FastifyReply, @UserAgent() userAgent: string, @Body() body: CredentialsDto) {
    const { accessToken, refreshToken } = await this.authService.signup(userAgent, body)
    return this.sendTokens(reply, refreshToken, accessToken)
  }

  @Post('signin')
  async signin(@Res({ passthrough: true }) reply: FastifyReply, @UserAgent() userAgent: string, @Body() body: CredentialsDto) {
    const { accessToken, refreshToken } = await this.authService.signin(userAgent, body)
    return this.sendTokens(reply, refreshToken, accessToken)
  }

  @Post('refresh')
  async refresh(@Res({ passthrough: true }) reply: FastifyReply, @UserAgent() userAgent: string, @Cookie(REFRESH_TOKEN_COOKIE_NAME) token: string) {
    if (!token) {
      throw new UnauthorizedException()
    }
    const { accessToken, refreshToken } = await this.authService.refresh(userAgent, token)
    return this.sendTokens(reply, refreshToken, accessToken)
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async logout(@Headers('Authorization') accessToken: string, @Cookie(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string) {
    accessToken = accessToken.split(' ')[1]
    return this.authService.logout({ accessToken, refreshToken })
  }

  private sendTokens(reply: FastifyReply, refreshToken: Token, accessToken: string) {
    reply.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken.token, {
      httpOnly: true,
      path: '/',
      sameSite: true,
      expires: refreshToken.expiresAt,
    })
    return { accessToken }
  }
}
