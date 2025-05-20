import { Inject, Injectable } from '@nestjs/common'
import { IUsersRepository, IUsersService, UsersData, UsersRepository } from './interfaces'
import { User } from './models'
import { hashData } from 'src/shared/functions'

@Injectable()
export class UsersService implements IUsersService {
  constructor(@Inject(UsersRepository) private readonly usersRepository: IUsersRepository) {}
  async save(user: UsersData) {
    user.password = await hashData(user.password)
    const newUser = new User(user)
    return this.usersRepository.save(newUser)
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id)
    return user
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email)
    return user
  }
}
