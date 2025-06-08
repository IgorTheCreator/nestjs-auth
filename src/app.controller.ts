import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Public, Role } from './shared/decorators'
import { LogoutGuard } from './modules/auth/guards'

@ApiBearerAuth()
@Controller()
export class AppController {
  @Get('ping')
  @Public()
  ping() {
    return 'pong'
  }

  @UseGuards(LogoutGuard)
  @Get('protected-test')
  @Role('ADMIN')
  protectedTest() {
    return 'Sensitive data'
  }

  @Public()
  @Get('public-test')
  publicTest() {
    return 'Public data'
  }
}
