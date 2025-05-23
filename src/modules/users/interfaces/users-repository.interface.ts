import { User } from '../models'

export interface IUsersRepository {
  save: (user: User) => Promise<User>
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
}

export const UsersRepository = Symbol('IUsersRepository')
