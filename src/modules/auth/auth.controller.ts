import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UserExistExceptionFilter } from 'src/common/filters';
import { AuthService, UsersService } from '../services.index';
import {
  CreateUserDto,
  SignInUserDto,
  SignInUserResponseDto,
  SignUpUserResponseDto,
} from '../users/dto';
import { AuthUser } from 'src/common/decorators';
import { UserEntity } from '../entities.index';

// #####################################
// #####################################
// #####################################

@ApiTags('Auth')
@Controller('auth')
@UseFilters(UserExistExceptionFilter)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  // ======================================

  @ApiOkResponse({
    description: 'Создание пользователя',
    type: () => SignUpUserResponseDto,
  })
  @Post('signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignUpUserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  // ======================================

  @ApiOkResponse({
    description: 'Авторизация пользователя',
    type: () => SignInUserResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(
    @AuthUser() user: UserEntity,
    @Body() auth: SignInUserDto, // eslint-disable-line
  ): Promise<SignInUserResponseDto> {
    return await this.authService.signIn(user);
  }

  // ======================================
}
