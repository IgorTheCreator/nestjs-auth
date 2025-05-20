import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { IPayload } from 'src/shared/interfaces'
import { ConfigService } from 'src/core/config/config.service'
import { IUsersService, Users } from 'src/modules/users/interfaces'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    @Inject(Users) private readonly usersService: IUsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET_KEY,
    })
  }

  async validate(payload: IPayload) {
    const user = await this.usersService.findById(payload.id)
    if (!user) {
      throw new UnauthorizedException()
    }
    return payload
  }
}
