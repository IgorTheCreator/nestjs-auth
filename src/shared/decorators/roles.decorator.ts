import { SetMetadata } from '@nestjs/common'
import { Roles } from '../consts'

export const ROLES_KEY = 'ROLES_KEY'

export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles)
