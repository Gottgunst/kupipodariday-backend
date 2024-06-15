import { ApiProperty, PickType } from '@nestjs/swagger';
import { OfferEntity } from '../entities/offer.entity';
import { IsNumber } from 'class-validator';
import { WishId } from 'src/common/types';

export class OfferDto extends PickType(OfferEntity, ['amount', 'hidden']) {
  @ApiProperty({
    description: 'Id желания',
  })
  @IsNumber()
  itemId: WishId;
}
