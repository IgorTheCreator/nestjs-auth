import { Module } from '@nestjs/common'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { ConfigModule } from './core/config/config.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { RedisModule } from './core/redis/redis.module'
import { PrismaModule } from './core/prisma/prisma.module'
import { JwtAuthGuard, RolesGuard } from './modules/auth/guards'

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.stdout.isTTY
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            }
          : undefined,
      },
    }),

    AuthModule,
    UsersModule,
    RedisModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
