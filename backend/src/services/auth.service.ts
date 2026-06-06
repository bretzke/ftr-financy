import { UserModel } from '../models/user.model'
import { prismaClient } from '../../prisma/prisma'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import { comparePassword, hashPassword } from '../utils/hash'
import { signJwt } from '../utils/jwt'
import {
  assertEmail,
  assertMinLength,
  assertNotEmpty,
} from '../utils/validation'

export class AuthService {
  async login(data: LoginInput) {
    const email = assertEmail(data.email)
    const password = assertNotEmpty(data.password, 'password')

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    })
    if (!existingUser) throw new Error('User not registered!')
    if (!existingUser.password) throw new Error('Invalid password!')

    const compare = await comparePassword(password, existingUser.password)
    if (!compare) throw new Error('Invalid password!')

    return this.generateTokens(existingUser)
  }

  async register(data: RegisterInput) {
    const name = assertMinLength(assertNotEmpty(data.name, 'name'), 2, 'name')
    const email = assertEmail(data.email)
    const password = assertMinLength(
      assertNotEmpty(data.password, 'password'),
      6,
      'password'
    )

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    })
    if (existingUser) throw new Error('Email already registered!')

    const hash = await hashPassword(password)

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    })
    return this.generateTokens(user)
  }

  generateTokens(user: UserModel) {
    const token = signJwt({ id: user.id, email: user.email }, '1d')
    const refreshToken = signJwt({ id: user.id, email: user.email }, '1d')
    return { token, refreshToken, user }
  }
}
