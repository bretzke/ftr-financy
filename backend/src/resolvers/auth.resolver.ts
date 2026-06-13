import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from '../dtos/input/auth.input'
import { LoginOutput, RegisterOutput } from '../dtos/output/auth.output'
import { UserModel } from '../models/user.model'
import { AuthService } from '../services/auth.service'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { IsAuth } from '../middlewares/auth.middleware'

@Resolver()
export class AuthResolver {
  private authService = new AuthService()

  @Mutation(() => LoginOutput)
  async login(
    @Arg('data', () => LoginInput) data: LoginInput
  ): Promise<LoginOutput> {
    return this.authService.login(data)
  }

  @Mutation(() => RegisterOutput)
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput
  ): Promise<RegisterOutput> {
    return this.authService.register(data)
  }

  @Mutation(() => UserModel)
  @UseMiddleware(IsAuth)
  async updateProfile(
    @Arg('data', () => UpdateProfileInput) data: UpdateProfileInput,
    @GqlUser() user: UserModel
  ): Promise<UserModel> {
    return this.authService.updateProfile(user.id, data)
  }
}
