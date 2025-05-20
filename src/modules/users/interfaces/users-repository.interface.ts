import { User } from '../models'

export interface IUsersRepository {
  save: (user: User) => Promise<Omit<User, 'hashPassword' | 'comparePassword'>>
  findById: (id: string) => Promise<Omit<User, 'hashPassword' | 'comparePassword'> | null>
  findByEmail: (email: string) => Promise<Omit<User, 'hashPassword' | 'comparePassword'> | null>
}

export const UsersRepository = Symbol('IUsersRepository')
