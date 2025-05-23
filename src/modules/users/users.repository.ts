import { Injectable } from '@nestjs/common'
import { IUsersRepository } from './interfaces/users-repository.interface'
import { User } from './models'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class UsersStorage implements IUsersRepository {
  constructor(private readonly db: PrismaService) {}
  async save(user: User): Promise<Omit<User, 'hashPassword' | 'comparePassword'>> {
    const newUser = await this.db.user.create({
      data: user,
    })
    return newUser
  }

  async findById(id: string): Promise<Omit<User, 'hashPassword' | 'comparePassword'> | null> {
    const user = await this.db.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }

  async findByEmail(email: string): Promise<Omit<User, 'hashPassword' | 'comparePassword'> | null> {
    const user = await this.db.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }
}
