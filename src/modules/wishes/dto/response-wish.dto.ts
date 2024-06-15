import { OmitType, PartialType } from '@nestjs/swagger';
import { WishEntity } from '../entities/wish.entity';

export class WishPartial extends PartialType(
  OmitType(WishEntity, ['owner', 'offers'] as const),
) {}
