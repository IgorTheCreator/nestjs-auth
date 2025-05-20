import { Module } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from 'src/core/config/config.service'
import { ConfigModule } from 'src/core/config/config.module'
import { Tokens, TokensRepository } from './interfaces'
import { TokensStorage } from './tokens.repository'

const TokensRepositoryProvider = {
  provide: TokensRepository,
  useClass: TokensStorage,
}

const TokensServiceProvider = {
  provide: Tokens,
  useClass: TokensService,
}

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        global: true,
        secret: config.JWT_SECRET_KEY,
        signOptions: { expiresIn: config.JWT_TOKEN_VALID },
      }),
    }),
  ],
  providers: [TokensServiceProvider, TokensRepositoryProvider],
  exports: [TokensServiceProvider],
})
export class TokensModule {}
