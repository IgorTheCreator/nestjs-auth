import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export class CredentialsDto extends createZodDto(credentialsSchema) {}
