import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestJsConfigModule } from '@nestjs/config'
import { ConfigService } from './config.service'

@Global()
@Module({
  imports: [NestJsConfigModule.forRoot()],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
