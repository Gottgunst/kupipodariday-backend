import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UserId } from '../types';
import { UserPublicProfileResponseDto } from 'src/modules/users/dto';

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

export const AuthPublicUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): UserPublicProfileResponseDto => {
    const request = ctx.switchToHttp().getRequest();
    const { wishlists, offers, wishes, email, ...publicUser } = request.user; // eslint-disable-line
    return publicUser;
  },
);
