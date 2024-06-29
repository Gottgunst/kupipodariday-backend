import { Injectable } from '@nestjs/common';
import { UsersService } from '../services.index';
import { JwtService } from '@nestjs/jwt';
import { verifyHash } from 'src/helpers/hash';
import { SignInUserResponseDto } from '../users/dto';
import { UserEntity } from '../entities.index';

// #####################################
// #####################################
// #####################################

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  // ======================================

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne({
      where: { username },
      select: ['username', 'password', 'id'],
    });

    if (user && (await verifyHash(password, user.password))) {
      const { password, ...result } = user; // eslint-disable-line
      return result;
    }
    return null;
  }

  // ======================================

  async signIn(user: UserEntity): Promise<SignInUserResponseDto> {
    const { username, id: sub } = user;
    return {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
  }
}
