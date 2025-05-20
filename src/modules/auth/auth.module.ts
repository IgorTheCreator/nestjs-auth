import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { TokensModule } from './modules/tokens/tokens.module'

@Module({
  imports: [PassportModule, UsersModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
