import { ApiProperty, PickType } from '@nestjs/swagger';
import { OfferEntity } from '../entities/offer.entity';
import { IsNumber } from 'class-validator';
import { WishEntity } from 'src/modules/wishes/entities/wish.entity';

export class OfferDto extends PickType(OfferEntity, ['amount', 'hidden']) {
  @ApiProperty({
    type: () => WishEntity['id'],
    description: 'Id желания',
  })
  @IsNumber()
  itemId: WishEntity['id'];
}
