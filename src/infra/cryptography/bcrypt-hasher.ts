import { compare, hash } from 'bcryptjs'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  comparer(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
