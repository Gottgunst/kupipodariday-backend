import { ApiProperty, PickType } from '@nestjs/swagger';
import { WishlistEntity } from '../entities/wishlist.entity';
import { IsArray } from 'class-validator';
import { WishEntity } from 'src/modules/wishes/entities/wish.entity';

export class CreateWishlistDto extends PickType(WishlistEntity, [
  'name',
  'image',
] as const) {
  @ApiProperty({
    isArray: true,
    type: () => [WishEntity['id']],
    description: 'Список Id желаний',
  })
  @IsArray()
  itemsId: WishEntity['id'][];
}
