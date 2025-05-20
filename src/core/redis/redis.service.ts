import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
import { ConfigService } from '../config/config.service'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super({
      host: configService.CACHE_HOST,
      port: configService.CACHE_PORT,
      password: configService.CACHE_PASSWORD,
    })
  }

  onModuleDestroy() {
    this.disconnect()
  }
}