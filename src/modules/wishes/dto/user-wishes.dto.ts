import { OmitType } from '@nestjs/swagger';
import { WishEntity } from '../entities/wish.entity';

export class UserWishesDto extends OmitType(WishEntity, ['owner'] as const) {}
