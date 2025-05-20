import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { Users, UsersRepository } from './interfaces'
import { UsersStorage } from './users.repository'

const UsersServiceProvider = {
  provide: Users,
  useClass: UsersService,
}

const UsersRepositoryProvider = {
  provide: UsersRepository,
  useClass: UsersStorage,
}

@Module({
  providers: [UsersServiceProvider, UsersRepositoryProvider],
  exports: [UsersServiceProvider],
})
export class UsersModule {}
