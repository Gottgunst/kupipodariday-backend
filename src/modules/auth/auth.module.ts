import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigFactory } from 'src/config/jwt-config';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from '../modules.index';
import { UserOrEmailExistExceptionsFilter } from 'src/common/filters';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({ useClass: JwtConfigFactory }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtConfigFactory,
    UserOrEmailExistExceptionsFilter,
  ],
  exports: [AuthService],
})
export class AuthModule {}
