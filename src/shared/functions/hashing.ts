import * as argon2 from 'argon2'

export async function hashData(data: string) {
  const hash = await argon2.hash(data, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
    hashLength: 32,
  })
  return hash
}

export async function compare(data: string, hash: string) {
  const isValid = await argon2.verify(hash, data)
  return isValid
}
