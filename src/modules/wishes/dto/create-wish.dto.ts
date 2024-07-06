import { PickType } from '@nestjs/swagger';
import { WishEntity } from '../entities/wish.entity';

export class CreateWishDto extends PickType(WishEntity, [
  'name',
  'link',
  'image',
  'price',
  'description',
] as const) {}
