import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class SignUpUserResponseDto extends PickType(UserEntity, [
  'id',
  'username',
  'about',
  'avatar',
  'email',
  'createdAt',
  'updatedAt',
] as const) {}
