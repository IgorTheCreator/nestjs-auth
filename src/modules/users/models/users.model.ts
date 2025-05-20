import { Roles } from 'src/shared/consts'

type UserConstructor = {
  email: string
  password: string
  role?: Roles
}

export class User {
  id: string
  email: string
  password: string
  role: Roles = 'USER'

  constructor({ email, password, role }: UserConstructor) {
    this.email = email
    this.password = password
    this.role = role ?? this.role
  }
}
