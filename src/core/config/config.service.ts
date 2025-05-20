import { Injectable } from '@nestjs/common'
import { ConfigService as NestJsConfigService } from '@nestjs/config'

@Injectable()
export class ConfigService {
  readonly APP_PORT: number
  readonly DB_URL: string
  readonly CACHE_PASSWORD: string
  readonly CACHE_PORT: number
  readonly CACHE_HOST: string
  readonly JWT_SECRET_KEY: string
  readonly JWT_TOKEN_VALID: string
  readonly REFRESH_TOKEN_VALID: number

  constructor(private readonly nestJsConfigService: NestJsConfigService) {
    this.APP_PORT = +this.nestJsConfigService.get<number>('APP_PORT', 3000)
    this.DB_URL = this.nestJsConfigService.getOrThrow<string>('DB_URL')
    this.CACHE_PASSWORD = this.nestJsConfigService.getOrThrow<string>('CACHE_PASSWORD')
    this.CACHE_PORT = this.nestJsConfigService.getOrThrow<number>('CACHE_PORT')
    this.CACHE_HOST = this.nestJsConfigService.getOrThrow<string>('CACHE_HOST')
    this.JWT_SECRET_KEY = this.nestJsConfigService.getOrThrow<string>('JWT_SECRET_KEY')
    this.JWT_TOKEN_VALID = this.nestJsConfigService.getOrThrow<string>('JWT_TOKEN_VALID')
    this.REFRESH_TOKEN_VALID = +this.nestJsConfigService.getOrThrow<number>('REFRESH_TOKEN_VALID')
  }
}
