import { ApiProperty, PickType } from '@nestjs/swagger';
import { WishlistEntity } from '../entities/wishlist.entity';
import { IsArray } from 'class-validator';
import { WishId } from 'src/common/types';

export class CreateWishlistDto extends PickType(WishlistEntity, [
  'name',
  'image',
  'description',
] as const) {
  @ApiProperty({
    isArray: true,
    description: 'Список Id желаний',
    default: [1, 2],
  })
  @IsArray()
  itemsId: WishId[];
}
