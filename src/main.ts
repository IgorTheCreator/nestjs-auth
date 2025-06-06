import fastifyCookie from '@fastify/cookie'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { patchNestJsSwagger } from 'nestjs-zod'
import { AppModule } from './app.module'
import { ConfigService } from './core/config/config.service'

async function build() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    cors: {
      origin: '*',
    },
    bufferLogs: true,
  })
  app.register(fastifyCookie)
  app.useLogger(app.get(Logger))

  patchNestJsSwagger()
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJs Project')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, documentFactory)

  app.enableShutdownHooks()

  return app
}

async function bootstrap() {
  const app = await build()
  const config = app.get(ConfigService)

  await app.listen(config.APP_PORT, '0.0.0.0')
}
bootstrap()
