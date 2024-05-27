import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/signup.auth.dto';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService, //private readonly authService: AuthService
  ) {}

  @Post('signup')
  async createUser(@Body() CreateUserDto: CreateUserDto) {
    // const user = await this.userService.create(CreateUserDto);
    // return this.authService.login(user);
  }

  // ################################

  @Post('signin')
  login(@Req() req: Request) {
    // return this.authService.login(req.user);
  }
}
