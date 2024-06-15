import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UserId } from '../types';

export const AuthUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);

export const AuthUserId = createParamDecorator(
  (data: never, ctx: ExecutionContext): UserId => {
    const request = ctx.switchToHttp().getRequest();

    return request.user.id;
  },
);
