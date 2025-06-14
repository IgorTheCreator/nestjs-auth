import { Controller, Get, Inject, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Public, Role } from './shared/decorators'
import { LogoutGuard } from './modules/auth/guards'
import { IUsersService, Users } from './modules/users/interfaces'

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(@Inject(Users) private readonly usersService: IUsersService) {}

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
    return this.usersService.findAll()
  }
}
