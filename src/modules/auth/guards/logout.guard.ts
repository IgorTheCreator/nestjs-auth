import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { RedisService } from 'src/core/redis/redis.service'

@Injectable()
export class LogoutGuard implements CanActivate {
  constructor(private readonly redis: RedisService) {}
  async canActivate(context: ExecutionContext) {
    const token = context.switchToHttp().getRequest().headers.authorization?.split(' ')[1]
    if (await this.redis.get(token)) {
      return false
    }
    return true
  }
}
