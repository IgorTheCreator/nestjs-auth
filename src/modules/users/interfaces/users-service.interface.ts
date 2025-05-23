import { User } from '../models'

export type UsersData = { email: string; password: string }

export interface IUsersService {
  save: (user: UsersData) => Promise<User>
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
}

export const Users = Symbol('IUsersService')
