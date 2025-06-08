import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ZodValidationPipe } from 'nestjs-zod'
import { LoggerModule } from 'nestjs-pino'
import {
  makeCounterProvider,
  makeGaugeProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus'
import { AppController } from './app.controller'
import { ConfigModule } from './core/config/config.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { RedisModule } from './core/redis/redis.module'
import { PrismaModule } from './core/prisma/prisma.module'
import { JwtAuthGuard, RolesGuard } from './modules/auth/guards'
import { MetricsMiddleware } from './metrics.middleware'
@Module({
  imports: [
    // NestJS modules
    ScheduleModule.forRoot(),

    // Core modules
    PrometheusModule.register(),
    ConfigModule,
    RedisModule,
    PrismaModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: {
          ignore(req) {
            if (req['originalUrl'] === '/metrics') {
              return true
            }
            return false
          },
        },
        transport: process.stdout.isTTY
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
              },
            }
          : undefined,
      },
    }),

    // Business modules
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    makeCounterProvider({
      name: 'count',
      help: 'metric_help',
      labelNames: ['method', 'origin'] as string[],
    }),
    makeGaugeProvider({
      name: 'gauge',
      help: 'metric_help',
    }),
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .exclude({ path: '/metrics', method: RequestMethod.GET })
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
  }
}
